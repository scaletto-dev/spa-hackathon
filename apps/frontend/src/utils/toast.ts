// Simple toast notification utility for user feedback
// Can be replaced with a more sophisticated solution later

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
    duration?: number;
    position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

class ToastManager {
    private container: HTMLDivElement | null = null;

    private getContainer(): HTMLDivElement {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.style.position = 'fixed';
            this.container.style.zIndex = '9999';
            this.container.style.display = 'flex';
            this.container.style.flexDirection = 'column';
            this.container.style.gap = '12px';
            this.container.style.padding = '20px';
            this.container.style.pointerEvents = 'none';
            document.body.appendChild(this.container);
        }
        return this.container;
    }

    private setPosition(position: string) {
        if (!this.container) return;

        // Reset positioning
        this.container.style.top = 'auto';
        this.container.style.bottom = 'auto';
        this.container.style.left = 'auto';
        this.container.style.right = 'auto';
        this.container.style.transform = 'none';

        switch (position) {
            case 'top-right':
                this.container.style.top = '0';
                this.container.style.right = '0';
                break;
            case 'top-center':
                this.container.style.top = '0';
                this.container.style.left = '50%';
                this.container.style.transform = 'translateX(-50%)';
                break;
            case 'bottom-right':
                this.container.style.bottom = '0';
                this.container.style.right = '0';
                break;
            case 'bottom-center':
                this.container.style.bottom = '0';
                this.container.style.left = '50%';
                this.container.style.transform = 'translateX(-50%)';
                break;
        }
    }

    show(message: string, type: ToastType = 'info', options: ToastOptions = {}) {
        const { duration = 3000, position = 'top-right' } = options;

        const container = this.getContainer();
        this.setPosition(position);

        const toast = document.createElement('div');
        toast.style.cssText = `
      background: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 500px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid ${this.getColor(type)};
    `;

        // Icon
        const icon = document.createElement('span');
        icon.style.fontSize = '20px';
        icon.textContent = this.getIcon(type);
        toast.appendChild(icon);

        // Message
        const messageEl = document.createElement('span');
        messageEl.style.cssText = `
      flex: 1;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    `;
        messageEl.textContent = message;
        toast.appendChild(messageEl);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = `
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      font-size: 18px;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
        closeBtn.textContent = '×';
        closeBtn.onclick = () => this.remove(toast);
        toast.appendChild(closeBtn);

        container.appendChild(toast);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        // Add animation styles
        if (!document.getElementById('toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
            document.head.appendChild(style);
        }
    }

    private remove(toast: HTMLElement) {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    private getColor(type: ToastType): string {
        switch (type) {
            case 'success':
                return '#10b981';
            case 'error':
                return '#ef4444';
            case 'warning':
                return '#f59e0b';
            case 'info':
                return '#3b82f6';
            default:
                return '#6b7280';
        }
    }

    private getIcon(type: ToastType): string {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return '';
        }
    }

    success(message: string, options?: ToastOptions) {
        this.show(message, 'success', options);
    }

    error(message: string, options?: ToastOptions) {
        this.show(message, 'error', options);
    }

    warning(message: string, options?: ToastOptions) {
        this.show(message, 'warning', options);
    }

    info(message: string, options?: ToastOptions) {
        this.show(message, 'info', options);
    }
}

export const toast = new ToastManager();
