// Beautiful toast notification utility with modern design
// Inspired by Sonner and modern UI patterns

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
   duration?: number;
   position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
}

class ToastManager {
   private container: HTMLDivElement | null = null;

   private getContainer(): HTMLDivElement {
      if (!this.container) {
         this.container = document.createElement("div");
         this.container.id = "toast-container";
         this.container.style.position = "fixed";
         this.container.style.zIndex = "9999";
         this.container.style.display = "flex";
         this.container.style.flexDirection = "column";
         this.container.style.gap = "16px";
         this.container.style.padding = "24px";
         this.container.style.pointerEvents = "none";
         document.body.appendChild(this.container);
      }
      return this.container;
   }

   private setPosition(position: string) {
      if (!this.container) return;

      // Reset positioning
      this.container.style.top = "auto";
      this.container.style.bottom = "auto";
      this.container.style.left = "auto";
      this.container.style.right = "auto";
      this.container.style.transform = "none";

      switch (position) {
         case "top-right":
            this.container.style.top = "0";
            this.container.style.right = "0";
            break;
         case "top-center":
            this.container.style.top = "0";
            this.container.style.left = "50%";
            this.container.style.transform = "translateX(-50%)";
            break;
         case "bottom-right":
            this.container.style.bottom = "0";
            this.container.style.right = "0";
            break;
         case "bottom-center":
            this.container.style.bottom = "0";
            this.container.style.left = "50%";
            this.container.style.transform = "translateX(-50%)";
            break;
      }
   }

   show(message: string, type: ToastType = "info", options: ToastOptions = {}) {
      const { duration = 4000, position = "top-right" } = options;

      const container = this.getContainer();
      this.setPosition(position);

      const toast = document.createElement("div");
      const colors = this.getColorScheme(type);

      toast.style.cssText = `
      background: ${colors.bg};
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 16px 20px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid ${colors.border};
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 320px;
      max-width: 480px;
      pointer-events: auto;
      animation: toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

      // Progress bar
      const progressBar = document.createElement("div");
      progressBar.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: ${colors.accent};
      width: 100%;
      transform-origin: left;
      animation: toastProgress ${duration}ms linear;
    `;
      toast.appendChild(progressBar);

      // Icon container with background
      const iconContainer = document.createElement("div");
      iconContainer.style.cssText = `
      background: ${colors.iconBg};
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 18px;
    `;
      iconContainer.innerHTML = this.getIcon(type);
      toast.appendChild(iconContainer);

      // Message container
      const messageContainer = document.createElement("div");
      messageContainer.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    `;

      // Message
      const messageEl = document.createElement("div");
      messageEl.style.cssText = `
      color: ${colors.text};
      font-size: 14px;
      font-weight: 600;
      line-height: 1.4;
      letter-spacing: -0.01em;
    `;
      messageEl.textContent = message;
      messageContainer.appendChild(messageEl);

      toast.appendChild(messageContainer);

      // Close button
      const closeBtn = document.createElement("button");
      closeBtn.style.cssText = `
      background: ${colors.closeBg};
      border: none;
      color: ${colors.closeText};
      cursor: pointer;
      font-size: 20px;
      padding: 0;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s ease;
      font-weight: 300;
    `;
      closeBtn.innerHTML = "×";
      closeBtn.onmouseover = () => {
         closeBtn.style.background = colors.closeHover;
         closeBtn.style.transform = "scale(1.05)";
      };
      closeBtn.onmouseout = () => {
         closeBtn.style.background = colors.closeBg;
         closeBtn.style.transform = "scale(1)";
      };
      closeBtn.onclick = () => this.remove(toast);
      toast.appendChild(closeBtn);

      // Add hover effect
      toast.onmouseenter = () => {
         toast.style.transform = "translateY(-2px) scale(1.01)";
         toast.style.boxShadow =
            "0 12px 40px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.10)";
         progressBar.style.animationPlayState = "paused";
      };
      toast.onmouseleave = () => {
         toast.style.transform = "translateY(0) scale(1)";
         toast.style.boxShadow =
            "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)";
         progressBar.style.animationPlayState = "running";
      };

      container.appendChild(toast);

      // Auto remove
      if (duration > 0) {
         setTimeout(() => this.remove(toast), duration);
      }

      // Add animation styles
      if (!document.getElementById("toast-animations")) {
         const style = document.createElement("style");
         style.id = "toast-animations";
         style.textContent = `
        @keyframes toastSlideIn {
          from {
            transform: translateX(120%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes toastSlideOut {
          from {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateX(120%) scale(0.95);
            opacity: 0;
          }
        }
        @keyframes toastProgress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `;
         document.head.appendChild(style);
      }
   }

   private remove(toast: HTMLElement) {
      toast.style.animation =
         "toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => {
         toast.remove();
      }, 300);
   }

   private getColorScheme(type: ToastType) {
      switch (type) {
         case "success":
            return {
               bg: "rgba(240, 253, 244, 0.95)",
               border: "rgba(34, 197, 94, 0.2)",
               accent: "#22c55e",
               iconBg: "rgba(34, 197, 94, 0.12)",
               text: "#166534",
               closeBg: "rgba(34, 197, 94, 0.08)",
               closeHover: "rgba(34, 197, 94, 0.15)",
               closeText: "#15803d",
            };
         case "error":
            return {
               bg: "rgba(254, 242, 242, 0.95)",
               border: "rgba(239, 68, 68, 0.2)",
               accent: "#ef4444",
               iconBg: "rgba(239, 68, 68, 0.12)",
               text: "#991b1b",
               closeBg: "rgba(239, 68, 68, 0.08)",
               closeHover: "rgba(239, 68, 68, 0.15)",
               closeText: "#dc2626",
            };
         case "warning":
            return {
               bg: "rgba(254, 252, 232, 0.95)",
               border: "rgba(245, 158, 11, 0.2)",
               accent: "#f59e0b",
               iconBg: "rgba(245, 158, 11, 0.12)",
               text: "#92400e",
               closeBg: "rgba(245, 158, 11, 0.08)",
               closeHover: "rgba(245, 158, 11, 0.15)",
               closeText: "#d97706",
            };
         case "info":
            return {
               bg: "rgba(239, 246, 255, 0.95)",
               border: "rgba(59, 130, 246, 0.2)",
               accent: "#3b82f6",
               iconBg: "rgba(59, 130, 246, 0.12)",
               text: "#1e40af",
               closeBg: "rgba(59, 130, 246, 0.08)",
               closeHover: "rgba(59, 130, 246, 0.15)",
               closeText: "#2563eb",
            };
         default:
            return {
               bg: "rgba(249, 250, 251, 0.95)",
               border: "rgba(107, 114, 128, 0.2)",
               accent: "#6b7280",
               iconBg: "rgba(107, 114, 128, 0.12)",
               text: "#374151",
               closeBg: "rgba(107, 114, 128, 0.08)",
               closeHover: "rgba(107, 114, 128, 0.15)",
               closeText: "#4b5563",
            };
      }
   }

   private getIcon(type: ToastType): string {
      switch (type) {
         case "success":
            return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
         case "error":
            return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15M5 5L15 15" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
         case "warning":
            return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6.66667V10M10 13.3333H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
         case "info":
            return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 13.3333V10M10 6.66667H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
         default:
            return "";
      }
   }

   success(message: string, options?: ToastOptions) {
      this.show(message, "success", options);
   }

   error(message: string, options?: ToastOptions) {
      this.show(message, "error", options);
   }

   warning(message: string, options?: ToastOptions) {
      this.show(message, "warning", options);
   }

   info(message: string, options?: ToastOptions) {
      this.show(message, "info", options);
   }
}

export const toast = new ToastManager();
