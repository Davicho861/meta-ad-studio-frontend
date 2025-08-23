import { Response } from 'express';
import Replicate from 'replicate';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../index'; // Import prisma client
import logger from '../utils/logger'; // Import logger
import * as Sentry from '@sentry/node'; // Import Sentry

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const generateVideo = async (req: Request, res: Response) => {
  logger.info({ body: req.body }, 'Video generation request received');
  try {
    const { imageUrl } = req.body;

    if (!imageUrl || typeof imageUrl !== 'string') {
      logger.warn({ imageUrl }, 'Invalid request: imageUrl is required and must be a string.');
      return res.status(400).json({ message: 'Invalid request: imageUrl is required and must be a string.' });
    }

    // Create a new video record in the database with "processing" status
    const newVideo = await prisma.video.create({
      data: {
        imageUrl,
        status: 'processing',
      },
    });
    logger.info({ videoId: newVideo.id }, 'New video record created in DB');

    // TODO: Replace with actual Cloud Run service URL for webhook
    const webhookUrl = `${process.env.CLOUD_RUN_SERVICE_URL}/api/v1/webhook`;

    const prediction = await replicate.predictions.create({
      version: "ee707735c7962ad0c5043bc6b6c420662d3d4537a4508679c90664766773673f", // Stable Diffusion Video model version
      input: { image: imageUrl },
      webhook: webhookUrl,
    });
    logger.info({ predictionId: prediction.id, imageUrl }, 'Replicate API call initiated');

    // Update the video record with Replicate ID and webhook URL
    await prisma.video.update({
      where: { id: newVideo.id },
      data: {
        replicateId: prediction.id,
        webhookUrl: webhookUrl,
      },
    });
    logger.info({ videoId: newVideo.id, replicateId: prediction.id }, 'Video record updated with Replicate ID and webhook URL');

    res.status(202).json({
      message: 'Video generation started',
      videoId: newVideo.id,
      replicatePredictionId: prediction.id,
      status: newVideo.status,
    });

  } catch (error: unknown) {
    logger.error({ error: (error as Error).message, stack: (error as Error).stack }, 'Error generating video:');
    Sentry.captureException(error); // Capture exception with Sentry
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const generateAdWithGemini = async (req: AuthenticatedRequest, res: Response) => {
  logger.info({ body: req.body }, 'Gemini ad generation request received');
  try {
    const { script, tone, visualStyle, musicGenre } = req.body;

    if (!script) {
      logger.warn({ body: req.body }, 'Invalid request: script is required.');
      return res.status(400).json({ message: 'Invalid request: script is required.' });
    }

    const { uid } = req.user;

    const user = await prisma.user.findUnique({
      where: { firebaseId: uid },
      include: { brandProfile: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const brandProfile = user.brandProfile;

    const prompt = `
      Eres un director de arte y productor de video experto. Tu tarea es crear un video publicitario de 5 segundos.

      **Guion:** "${script}"

      **Identidad de Marca:**
      - Nombre: "${brandProfile?.brandName || ''}"
      - Eslogan: "${brandProfile?.slogan || ''}"
      - Colores Principales: [${brandProfile?.brandColors.join(', ') || ''}]

      **Dirección Creativa:**
      - Tono de Voz: "${tone}"
      - Estilo Visual: "${visualStyle}"
      - Música: "${musicGenre}"

      **Instrucciones:**
      1.  Usa la imagen como el elemento central.
      2.  Añade efectos visuales que coincidan con el estilo "${visualStyle}".
      3.  Incorpora sutilmente los colores de la marca en los gráficos o transiciones.
      4.  Genera una voz en off que lea el guion con un tono "${tone}".
      5.  Selecciona o genera una pista de música que encaje con "{musicGenre}".
      6.  Finaliza el video mostrando el logo de la marca [usando la URL del logo si está disponible] y el eslogan.
    `;

    // For now, we'll just log the prompt.
    // The actual call to Gemini and Replicate will be implemented later.
    logger.info({ prompt }, 'Generated prompt for Gemini');

    // TODO: Implement actual Gemini API call and video creation
    const newVideo = await prisma.video.create({
      data: {
        imageUrl: '', // Placeholder
        status: 'completed', // Placeholder status
        videoUrl: "https://replicate.delivery/pbxt/J05Yx4T5zJkL2zXyJzJ3zJjYJqJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJjYJ-",
        userId: user.id,
      },
    });

    res.status(200).json({ videoUrl: newVideo.videoUrl });

  } catch (error: unknown) {
    logger.error({ error: (error as Error).message, stack: (error as Error).stack }, 'Error generating ad with Gemini:');
    Sentry.captureException(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getCreations = async (req: AuthenticatedRequest, res: Response) => {
  logger.info('Get creations request received');
  try {
    const { uid } = req.user;

    const user = await prisma.user.findUnique({
      where: { firebaseId: uid },
      include: { videos: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.videos);
  } catch (error: unknown) {
    logger.error({ error: (error as Error).message, stack: (error as Error).stack }, 'Error getting creations:');
    Sentry.captureException(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  logger.info({ body: req.body }, 'Webhook received from Replicate');
  try {
    const { id, status, output, error } = req.body; // Replicate's prediction ID and status

    if (!id) {
      logger.warn({ body: req.body }, 'Webhook received without prediction ID');
      return res.status(400).json({ message: 'Invalid webhook payload: prediction ID is missing.' });
    }

    const existingVideo = await prisma.video.findUnique({
      where: { replicateId: id },
    });

    if (!existingVideo) {
      logger.warn({ replicateId: id }, 'No matching video found for Replicate ID');
      return res.status(404).json({ message: 'No matching video found for the provided Replicate ID.' });
    }

    const updateData: { status: string; videoUrl?: string; error?: string } = { status };

    if (status === 'succeeded' && output && output.length > 0) {
      updateData.videoUrl = output[0]; // Assuming output[0] is the video URL
      logger.info({ videoId: existingVideo.id, videoUrl: updateData.videoUrl }, 'Video generation succeeded, updating video record');
    } else if (status === 'failed' && error) {
      updateData.error = error;
      logger.error({ videoId: existingVideo.id, error }, 'Video generation failed');
    } else {
      logger.info({ videoId: existingVideo.id, status }, 'Webhook received with intermediate status or no output');
    }

    await prisma.video.update({
      where: { id: existingVideo.id },
      data: updateData,
    });
    logger.info({ videoId: existingVideo.id, status: updateData.status }, 'Video record updated from webhook');

    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error: unknown) {
    logger.error({ error: (error as Error).message, stack: (error as Error).stack, body: req.body }, 'Error processing webhook:');
    Sentry.captureException(error); // Capture exception with Sentry
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
