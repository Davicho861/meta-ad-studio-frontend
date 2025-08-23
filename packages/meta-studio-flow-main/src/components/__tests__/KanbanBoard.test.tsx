import { render, screen } from '@testing-library/react';
import { KanbanBoard } from '../KanbanBoard';
import { useIssues } from '../../hooks/useIssues';
import { useIssueStatus } from '../../hooks/useIssueStatus';
import { DndContext } from '@dnd-kit/core';

jest.mock('../../hooks/useIssues');
jest.mock('../../hooks/useIssueStatus');

const mockUseIssues = useIssues as jest.Mock;
const mockUseIssueStatus = useIssueStatus as jest.Mock;

const mockIssues = [
  { id: '1', title: 'Task 1', status: 'To Do', priority: 'High' },
  { id: '2', title: 'Task 2', status: 'In Progress', priority: 'Medium' },
  { id: '3', title: 'Task 3', status: 'Done', priority: 'Low' },
];

describe('KanbanBoard', () => {
  beforeEach(() => {
    mockUseIssueStatus.mockReturnValue({ mutate: jest.fn() });
  });

  it('should display a loading message', () => {
    mockUseIssues.mockReturnValue({ data: [], isLoading: true });
    render(
      <DndContext onDragEnd={() => {}}>
        <KanbanBoard />
      </DndContext>
    );
    expect(screen.getByText('Loading Kanban board...')).toBeInTheDocument();
  });

  it('should render columns and issues correctly', () => {
    mockUseIssues.mockReturnValue({ data: mockIssues, isLoading: false });
    render(
      <DndContext onDragEnd={() => {}}>
        <KanbanBoard />
      </DndContext>
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('In Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });
});
