/// <reference types="pinia" />

import { promiseTimeout } from "@vueuse/core";
import { computed, type ComputedRef, defineStore, ref, type Ref, shallowReactive, type VNode, watchEffect } from "#imports";

interface ModalContext {
    vnode: ComputedRef<VNode>;
    zIndex: number;
    duration: number;
    open: Ref<boolean>;
    close: ComputedRef<() => void>;
}

type ModalStatus = "closed" | "open" | "closing";

interface UseModalOptions {
    duration?: number;
    immediate?: boolean;
    unique?: boolean;
}

export const useModalStore = defineStore("modal", () => {
    const modals = shallowReactive<ModalContext[]>([]);

    function use(render: () => VNode, options: UseModalOptions = {}) {
        const {
            duration = 400,
            immediate = false,
            unique = false,
        } = options;

        let ctx: ModalContext;

        /**
         * 弹窗是否处于显示状态
         * 此变量用于在弹窗上下文被插入列表时单独地触发各自的 transition 动画，而不是由 transition-group 统一处理
         */
        const status = ref<ModalStatus>("closed");

        //立即打开
        immediate && open();

        function open() {
            if (unique && indexOf() !== -1) {
                return;
            }

            const vnode = computed(render);
            watchEffect(() => {
                vnode.value.props = {
                    onClose: close,
                    onVnodeMounted() {
                        status.value = "open";
                    },
                    ...vnode.value.props,
                };
            });

            const last = modals.at(-1);
            const zIndex = (last?.zIndex ?? 510) + 2;

            ctx = {
                vnode,
                zIndex,
                duration,
                open: computed(() => status.value === "open"),
                close: computed(() => vnode.value.props?.onClose),
            };

            modals.push(ctx);
        }

        async function close() {
            status.value = "closing";
            await promiseTimeout(duration);
            status.value = "closed";

            const i = indexOf();
            if (i !== -1) {
                modals.splice(i, 1);
            }
        }

        function indexOf() {
            return modals.indexOf(ctx);
        }

        return {
            open,
            close,
            status,
        };
    }

    return {
        modals,
        use,
    };
});
