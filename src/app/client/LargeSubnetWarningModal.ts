import { t } from '../i18n';
import { Modal } from '../ui/Modal';

export interface LargeSubnetWarningOptions {
    totalHosts: number;
    subnetBreakdown: { normalized: string; hostCount: number; annotation: string }[];
    onContinue: () => void;
}

export class LargeSubnetWarningModal extends Modal {
    private readonly data: LargeSubnetWarningOptions;

    constructor(options: LargeSubnetWarningOptions) {
        super({ title: t('large.title') });
        this.data = options;
        this.dialog.classList.add('large-subnet-warning-modal');
    }

    protected buildBody(container: HTMLElement): void {
        // The Modal base's buildBody is called DURING super() — at that point
        // this.data is not yet set. We fill in content via a one-shot microtask
        // that runs after the constructor returns and this.data is populated.
        queueMicrotask(() => this.fillBody(container));
    }

    private fillBody(container: HTMLElement): void {
        const summary = document.createElement('p');
        summary.innerHTML = t('large.summary', {
            hosts: t('large.hosts', { count: this.data.totalHosts }),
            subnets: t('large.subnets', { count: this.data.subnetBreakdown.length }),
            duration: formatDuration(this.data.totalHosts),
        });
        container.appendChild(summary);

        const list = document.createElement('ul');
        list.style.cssText = 'font-family: var(--font-mono, monospace); font-size: 13px; padding-left: 20px;';
        for (const row of this.data.subnetBreakdown) {
            const li = document.createElement('li');
            li.textContent = t('scan.rowLabel', {
                subnet: row.normalized,
                hosts: t('large.hosts', { count: row.hostCount }),
                annotation: row.annotation,
            });
            list.appendChild(li);
        }
        container.appendChild(list);

        const advice = document.createElement('p');
        advice.textContent = t('large.advice');
        advice.style.cssText = 'margin-top: 12px; color: var(--text-color-light); font-size: 13px;';
        container.appendChild(advice);
    }

    protected override buildFooter(): HTMLElement | null {
        const footer = document.createElement('div');
        const cancel = document.createElement('button');
        cancel.textContent = t('common.cancel');
        cancel.addEventListener('click', () => this.close());
        const cont = document.createElement('button');
        cont.textContent = t('large.continue');
        cont.addEventListener('click', () => {
            // Close first: onContinue closes the parent, which closes its open
            // children, so closing after it would close this dialog twice.
            this.close();
            this.data.onContinue();
        });
        footer.appendChild(cancel);
        footer.appendChild(cont);
        return footer;
    }
}

function formatDuration(totalHosts: number): string {
    const seconds = Math.round((totalHosts / 1000) * 30);
    if (seconds < 60) return t('large.seconds', { count: seconds });
    const minutes = Math.round(seconds / 60);
    return t('large.minutes', { count: minutes });
}
