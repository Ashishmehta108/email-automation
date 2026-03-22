import { Pencil, Trash2, Download, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { CertificateDto } from '@/types/certificate.types';

interface CertificateRowProps {
  certificate: CertificateDto;
  onEdit: (certificate: CertificateDto) => void;
  onDelete: (certificate: CertificateDto) => void;
  onGenerate: (certificate: CertificateDto) => void;
}

export function CertificateRow({ certificate, onEdit, onDelete, onGenerate }: CertificateRowProps) {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-outline', bg: 'bg-surface-high' },
    generated: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary-fixed/20' },
    failed: { icon: XCircle, color: 'text-error', bg: 'bg-error-container/20' },
  };

  const status = statusConfig[certificate.status];
  const StatusIcon = status.icon;

  return (
    <div className="grid grid-cols-12 gap-4 items-center glass-panel px-6 py-5 rounded-sm border border-white/5 transition-all duration-300 hover:bg-white/[0.02] cursor-pointer">
      <div className="col-span-3 flex items-center gap-4">
        <div className="w-10 h-10 bg-surface-highest rounded-full flex items-center justify-center border border-white/10 text-primary font-headline font-bold">
          {certificate.studentId}
        </div>
        <div>
          <p className="text-on-surface font-medium text-sm">Student #{certificate.studentId}</p>
          <p className="text-[11px] text-outline/60 mt-0.5">ID: {certificate.studentId}</p>
        </div>
      </div>
      <div className="col-span-2 text-center font-headline text-on-surface-variant tracking-wider">
        {certificate.eventName}
      </div>
      <div className="col-span-2 flex justify-center">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {certificate.status}
        </span>
      </div>
      <div className="col-span-2 text-outline text-sm">{certificate.issuedBy}</div>
      <div className="col-span-2 text-center text-outline text-xs tabular-nums">
        {new Date(certificate.issueDate).toLocaleDateString()}
      </div>
      <div className="col-span-1 flex justify-end gap-2 text-outline">
        {certificate.status === 'pending' && (
          <button onClick={() => onGenerate(certificate)} className="hover:text-primary transition-colors" title="Generate PDF">
            <Download className="w-[16px] h-[16px]" />
          </button>
        )}
        {certificate.status === 'generated' && certificate.pdfPath && (
          <a 
            href={`/api${certificate.pdfPath}`} 
            download 
            className="hover:text-primary transition-colors"
            title="Download PDF"
          >
            <Download className="w-[16px] h-[16px]" />
          </a>
        )}
        <button onClick={() => onEdit(certificate)} className="hover:text-primary transition-colors">
          <Pencil className="w-[18px] h-[18px]" />
        </button>
        <button onClick={() => onDelete(certificate)} className="hover:text-error transition-colors">
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
