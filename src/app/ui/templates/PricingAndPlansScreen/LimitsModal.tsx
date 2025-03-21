import { BaseModal } from '@/app/ui/modals';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

const LimitsModal = () => (
    <BaseModal
        adaptBreakpoint={Breakpoint.sm}
        title={'Limits Apply'}
        className={'max-w-[56rem]'}
        classNameContent={'sm:p-[min(5.3dvw)] sm:landscape:p-xs'}
        classNameTitle={'sm:x-[mb-[5.3dvw],text-[1.7rem]] sm:landscape:mb-s'}
    >
        <div className={`max-h-[79dvh] sm:x-[text-[1rem],overflow-y-scroll] sm:landscape:max-h-[55dvh]`}>
            <h2 className={'mb-[0.5rem] text-18 font-bold sm:mb-0'}>Tidal Pro Plan Subscription Limitations</h2>
            <div>
                <span>
                    As part of the Tidal Pro plan, specific usage limitations are implemented to maintain optimal
                    service quality and safeguard system performance across the platform. These limitations are designed
                    to prevent potential traffic overloads and ensure the consistent functioning of the application for
                    all users. The following constraints apply:
                </span>
            </div>
            <ul className={'my-[1.15rem] flex list-disc flex-col gap-[0.84rem] pl-[1.5rem]'}>
                <li>
                    <span className={'font-bold'}>Daily Server Space Allocation:</span> Each Pro plan user is allocated
                    a defined amount of server space on a daily basis. This allocation, while generous, is designed to
                    manage overall system load effectively and prevent any one user from monopolizing resources. The
                    limits ensure stable performance and equitable access to server resources for all users.
                </li>
                <li>
                    <span className={'font-bold'}>Application Performance:</span> To ensure continued system efficiency,
                    safeguards are in place that may impact performance if certain thresholds are exceeded.
                    Specifically, if a user exceeds 100 Key compositions within a 24-hour period, the application may
                    experience reduced speed or performance. This mechanism is an intentional measure to maintain the
                    integrity of the platform and ensure its smooth operation for all users.
                </li>
                <li>
                    <span className={'font-bold'}>Abuse and Misuse:</span> Any attempts to circumvent or exploit these
                    limitations, such as through excessive server space usage or resource-intensive activities, may
                    result in temporary or permanent access restrictions or a slowdown in service. These measures are
                    enforced to preserve the platform&apos;s overall stability, reliability and security.
                </li>
            </ul>
            <div>
                <span>
                    These limitations are essential to protect the Tidal platform’s operational integrity and ensure a
                    high-quality experience for all users. Adherence to these guidelines allows for the continued
                    delivery of a consistent, reliable, and performant service.
                </span>
            </div>
        </div>
    </BaseModal>
);

export { LimitsModal };
