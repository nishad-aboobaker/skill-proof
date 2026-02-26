import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

export type ViolationType =
    | 'tab_switch'
    | 'window_blur'
    | 'mouse_leave'
    | 'copy_attempt'
    | 'paste_attempt'
    | 'cut_attempt'
    | 'right_click'
    | 'devtools_shortcut';

export interface Violation {
    type: ViolationType;
    message: string;
    timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ProctorService {
    private violation$ = new Subject<Violation>();
    violations$ = this.violation$.asObservable();

    private active = false;

    // Bound listener references so we can removeEventListener cleanly
    private handlers: { target: EventTarget; event: string; fn: EventListener }[] = [];

    constructor(private zone: NgZone) { }

    startProctoring(): void {
        if (this.active) return;
        this.active = true;

        this.on(document, 'visibilitychange', () => {
            if (document.hidden) this.emit('tab_switch', 'You switched tabs or minimized the window.');
        });

        this.on(window, 'blur', () => {
            this.emit('window_blur', 'The assessment window lost focus.');
        });

        this.on(document, 'mouseleave', (e: Event) => {
            const me = e as MouseEvent;
            if (me.clientY <= 0 || me.clientX <= 0 ||
                me.clientX >= window.innerWidth || me.clientY >= window.innerHeight) {
                this.emit('mouse_leave', 'Your mouse left the assessment window.');
            }
        });

        this.on(document, 'contextmenu', (e: Event) => {
            e.preventDefault();
            this.emit('right_click', 'Right-click is disabled during the assessment.');
        });

        this.on(document, 'copy', (e: Event) => {
            e.preventDefault();
            this.emit('copy_attempt', 'Copying text is not allowed during the assessment.');
        });

        this.on(document, 'cut', (e: Event) => {
            e.preventDefault();
            this.emit('cut_attempt', 'Cutting text is not allowed during the assessment.');
        });

        this.on(document, 'paste', (e: Event) => {
            e.preventDefault();
            this.emit('paste_attempt', 'Pasting text is not allowed during the assessment.');
        });

        this.on(document, 'keydown', (e: Event) => {
            const ke = e as KeyboardEvent;
            const isDevTools =
                ke.key === 'F12' ||
                (ke.ctrlKey && ke.shiftKey && ['I', 'J', 'C'].includes(ke.key)) ||
                (ke.ctrlKey && ke.key === 'U');
            if (isDevTools) {
                ke.preventDefault();
                this.emit('devtools_shortcut', 'Developer tools shortcuts are disabled.');
            }
        });
    }

    stopProctoring(): void {
        this.handlers.forEach(({ target, event, fn }) =>
            target.removeEventListener(event, fn)
        );
        this.handlers = [];
        this.active = false;
    }

    private on(target: EventTarget, event: string, fn: (e: Event) => void): void {
        const listener = (e: Event) => this.zone.run(() => fn(e));
        target.addEventListener(event, listener);
        this.handlers.push({ target, event, fn: listener });
    }

    private emit(type: ViolationType, message: string): void {
        this.violation$.next({ type, message, timestamp: new Date() });
    }
}
