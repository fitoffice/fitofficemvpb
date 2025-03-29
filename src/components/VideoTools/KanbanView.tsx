import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Clock, Calendar } from 'lucide-react';

interface KanbanViewProps {
  files: Array<{
    name: string;
    scheduledDate?: Date;
    preview?: string;
    platforms?: Array<{ platformId: string }>;
    type: string;
    status?: 'pending' | 'scheduled' | 'error';
  }>;
  onStatusChange: (fileId: string, newStatus: string) => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({ files, onStatusChange }) => {
  const columns = {
    pending: {
      title: 'Pending',
      items: files.filter(f => !f.status || f.status === 'pending'),
    },
    scheduled: {
      title: 'Scheduled',
      items: files.filter(f => f.status === 'scheduled'),
    },
    error: {
      title: 'Issues',
      items: files.filter(f => f.status === 'error'),
    },
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      onStatusChange(draggableId, destination.droppableId);
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'pending':
        return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'scheduled':
        return 'from-green-50 to-green-100 border-green-200';
      case 'error':
        return 'from-red-50 to-red-100 border-red-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className={`bg-gradient-to-b ${getColumnColor(columnId)} 
                         rounded-xl shadow-lg p-4 border`}
            >
              <h3 className="text-lg font-semibold mb-4 px-2">
                {column.title}
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({column.items.length})
                </span>
              </h3>

              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[200px]"
                  >
                    {column.items.map((file, index) => (
                      <Draggable
                        key={file.name}
                        draggableId={file.name}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white rounded-lg shadow-sm p-4 
                                      ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}
                                      transition-all duration-200`}
                          >
                            <div className="flex items-start space-x-3">
                              {file.preview && (
                                <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                                  {file.type.startsWith('image/') ? (
                                    <img
                                      src={file.preview}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <video
                                      src={file.preview}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              )}
                              <div className="flex-grow min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {file.name}
                                </h4>
                                {file.scheduledDate && (
                                  <div className="flex items-center mt-1 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>
                                      {new Date(file.scheduledDate).toLocaleDateString()}
                                    </span>
                                    <Clock className="w-4 h-4 ml-2 mr-1" />
                                    <span>
                                      {new Date(file.scheduledDate).toLocaleTimeString()}
                                    </span>
                                  </div>
                                )}
                                {file.platforms && file.platforms.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {file.platforms.map(platform => (
                                      <span
                                        key={platform.platformId}
                                        className="px-2 py-0.5 bg-gray-100 text-gray-600 
                                                 rounded-full text-xs font-medium"
                                      >
                                        {platform.platformId}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanView;
