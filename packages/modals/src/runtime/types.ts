export type { UseModalOptions } from "./store";

export interface ModalProps {
    /**
     * 过渡动画时长 (ms)
     * @default 400
     */
    duration?: number;
    /**
     * 模态框开关状态
     * @internal
     */
    open?: boolean;
}

export interface ModalEmits {
    close: [];
}
