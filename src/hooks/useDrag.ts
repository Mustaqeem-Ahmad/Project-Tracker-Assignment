import { useRef, useCallback, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Task, Status } from '../types';

interface DragState {
  taskId: string;
  sourceStatus: Status;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  cloneEl: HTMLElement | null;
  originEl: HTMLElement | null;
  placeholderHeight: number;
}

export function useDrag() {
  const dragRef = useRef<DragState | null>(null);
  const updateTaskStatus = useTaskStore(s => s.updateTaskStatus);

  const startDrag = useCallback(
    (e: React.PointerEvent, task: Task, cardEl: HTMLElement) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = cardEl.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      // Create floating clone
      const clone = cardEl.cloneNode(true) as HTMLElement;
      Object.assign(clone.style, {
        position: 'fixed',
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        pointerEvents: 'none',
        opacity: '0.9',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        zIndex: '9999',
        transform: 'rotate(1.5deg) scale(1.02)',
        transition: 'transform 0.1s, box-shadow 0.1s',
        cursor: 'grabbing',
      });
      document.body.appendChild(clone);

      // Hide original visually but keep space
      cardEl.style.opacity = '0';
      cardEl.style.pointerEvents = 'none';

      dragRef.current = {
        taskId: task.id,
        sourceStatus: task.status,
        startX: e.clientX,
        startY: e.clientY,
        offsetX,
        offsetY,
        cloneEl: clone,
        originEl: cardEl,
        placeholderHeight: rect.height,
      };

      // Emit drag start
      window.dispatchEvent(
        new CustomEvent('drag-start', { detail: { taskId: task.id, height: rect.height } })
      );

      cardEl.setPointerCapture(e.pointerId);
    },
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag?.cloneEl) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      drag.cloneEl.style.transform = `translate(${dx}px, ${dy}px) rotate(1.5deg) scale(1.02)`;

      // Column hit detection
      drag.cloneEl.style.display = 'none';
      const el = document.elementFromPoint(e.clientX, e.clientY);
      drag.cloneEl.style.display = '';

      const col = el?.closest('[data-column]');
      const column = col?.getAttribute('data-column') as Status | null;

      window.dispatchEvent(
        new CustomEvent('drag-over-column', { detail: { column } })
      );
    };

    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      drag.cloneEl?.style.setProperty('display', 'none');
      const el = document.elementFromPoint(e.clientX, e.clientY);
      drag.cloneEl?.style.removeProperty('display');

      const col = el?.closest('[data-column]');
      const targetStatus = col?.getAttribute('data-column') as Status | null;

      if (targetStatus && targetStatus !== drag.sourceStatus) {
        updateTaskStatus(drag.taskId, targetStatus);
        cleanup();
      } else if (targetStatus && targetStatus === drag.sourceStatus) {
        cleanup();
      } else {
        // Snap back
        snapBack(drag);
      }

      window.dispatchEvent(new CustomEvent('drag-end'));
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [updateTaskStatus]);

  function cleanup() {
    const drag = dragRef.current;
    if (!drag) return;
    drag.cloneEl?.remove();
    if (drag.originEl) {
      drag.originEl.style.opacity = '';
      drag.originEl.style.pointerEvents = '';
    }
    dragRef.current = null;
  }

  function snapBack(drag: DragState) {
    const { cloneEl, originEl } = drag;
    if (!cloneEl || !originEl) { cleanup(); return; }

    const originRect = originEl.getBoundingClientRect();
    const cloneRect = cloneEl.getBoundingClientRect();
    const dx = originRect.left - cloneRect.left;
    const dy = originRect.top - cloneRect.top;

    const currentTransform = cloneEl.style.transform;
    const anim = cloneEl.animate(
      [
        { transform: currentTransform, opacity: '0.9' },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(1)`, opacity: '1' },
      ],
      { duration: 280, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' }
    );
    anim.onfinish = () => cleanup();
  }

  return { startDrag };
}
