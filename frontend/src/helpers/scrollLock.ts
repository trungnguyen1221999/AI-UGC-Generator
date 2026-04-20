export class ScrollLock {
    private static readonly BODY_SCROLL_LOCK_CLASS = 'overflow-hidden';

    static preventScrolling(): void {
        if (typeof document === 'undefined') return;
        document.body.classList.add(ScrollLock.BODY_SCROLL_LOCK_CLASS);
    }

    static restoreScrolling(): void {
        if (typeof document === 'undefined') return;
        document.body.classList.remove(ScrollLock.BODY_SCROLL_LOCK_CLASS);
    }
}
