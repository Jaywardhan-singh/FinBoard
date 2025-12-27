'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Widget } from '@/store/dashboardStore';
import { WidgetWrapper } from './WidgetWrapper';

interface WidgetGridProps {
  widgets: Widget[];
  onReorder: (startIndex: number, endIndex: number) => void;
  onRefresh: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface SortableWidgetProps {
  widget: Widget;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({
  widget,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-drag="true"]')) {
      return;
    }
    if (listeners.onPointerDown) {
      listeners.onPointerDown(e);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      className="relative cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={listeners.onPointerMove}
      onPointerUp={listeners.onPointerUp}
    >
      <WidgetWrapper 
        widget={widget} 
        onEdit={onEdit} 
        onDelete={onDelete}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onReorder,
  onRefresh,
  onEdit,
  onDelete,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={widgets.map((w) => w.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              onEdit={() => onEdit(widget.id)}
              onDelete={() => onDelete(widget.id)}
              onRefresh={() => onRefresh(widget.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
