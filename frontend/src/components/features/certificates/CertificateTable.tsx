import type { CertificateDto } from '@/types/certificate.types';
import { CertificateRow } from './CertificateRow';

interface CertificateTableProps {
  certificates: CertificateDto[];
  onEdit: (certificate: CertificateDto) => void;
  onDelete: (certificate: CertificateDto) => void;
  onGenerate: (certificate: CertificateDto) => void;
}

export function CertificateTable({ certificates, onEdit, onDelete, onGenerate }: CertificateTableProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 px-6 mb-4 text-[10px] uppercase tracking-[0.2em] text-outline font-medium">
        <div className="col-span-3">Student</div>
        <div className="col-span-2 text-center">Event</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-2">Issued By</div>
        <div className="col-span-2 text-center">Issue Date</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      {certificates.map((certificate) => (
        <CertificateRow
          key={certificate.id}
          certificate={certificate}
          onEdit={onEdit}
          onDelete={onDelete}
          onGenerate={onGenerate}
        />
      ))}
    </div>
  );
}
