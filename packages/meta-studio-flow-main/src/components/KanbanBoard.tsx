import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useIssues } from '../hooks/useIssues';
import { useIssueStatus } from '../hooks/useIssueStatus';
import { SortableItem } from './SortableItem';

interface KanbanBoardProps {
  sprintId?: string;
  projectId?: string;
  assigneeId?: string;
  dueThisWeek?: boolean;
}

export function KanbanBoard({ sprintId, projectId, assigneeId, dueThisWeek }: KanbanBoardProps) {
  const { data: issues = [], isLoading } = useIssues({ sprintId, projectId, assigneeId, dueThisWeek });
  const { mutate: updateIssueStatus } = useIssueStatus();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columns: { id: string; title: string }[] = [
    { id: 'To Do', title: 'To Do' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'In Review', title: 'In Review' },
    { id: 'Done', title: 'Done' },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const issueId = active.id as string;
    const newStatus = over.id.toString().split('-')[0]; // Extract status from column id
    updateIssueStatus({ issueId, status: newStatus });
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <p>Loading Kanban board...</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {columns.map((column) => (
              <Card key={column.id}>
                <CardHeader>
                  <CardTitle>{column.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SortableContext items={issues.filter((issue) => issue.status === column.id).map((issue) => issue.id)} strategy={verticalListSortingStrategy}>
                    {issues
                      .filter((issue) => issue.status === column.id)
                      .map((issue) => (
                        <SortableItem key={issue.id} id={issue.id}>
                          <div className="p-2 mb-2 bg-gray-100 rounded shadow">
                            <h3 className="font-bold">{issue.title}</h3>
                            <p className="text-sm">Priority: {issue.priority}</p>
                          </div>
                        </SortableItem>
                      ))}
                  </SortableContext>
                </CardContent>
              </Card>
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}
