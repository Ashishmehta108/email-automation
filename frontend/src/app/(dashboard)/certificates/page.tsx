"use client";

import { useState } from 'react';
import { useCertificates } from '@/hooks/useCertificates';
import { CertificateTable } from '@/components/features/certificates/CertificateTable';
import { CertificateTableSkeleton } from '@/components/features/certificates/CertificateTableSkeleton';
import { EmptyState } from '@/components/features/certificates/EmptyState';
import { ErrorState } from '@/components/features/certificates/ErrorState';
import { CreateCertificateModal } from '@/components/features/certificates/CreateCertificateModal';
import { EditCertificateModal } from '@/components/features/certificates/EditCertificateModal';
import { DeleteCertificateDialog } from '@/components/features/certificates/DeleteCertificateDialog';
import { GenerateCertificateModal } from '@/components/features/certificates/GenerateCertificateModal';
import type { CertificateDto } from '@/types/certificate.types';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

export default function CertificatesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateDto | null>(null);

  const { data, isLoading, error, refetch } = useCertificates();

  const handleEdit = (certificate: CertificateDto) => {
    setSelectedCertificate(certificate);
    setEditOpen(true);
  };

  const handleDelete = (certificate: CertificateDto) => {
    setSelectedCertificate(certificate);
    setDeleteOpen(true);
  };

  const handleGenerate = (certificate: CertificateDto) => {
    setSelectedCertificate(certificate);
    setGenerateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
              Certificates
            </h2>
            <p className="text-sm text-outline mt-1">Manage and generate certificates</p>
          </div>
          <Button className="btn-primary-gradient">Create Certificate</Button>
        </div>
        <CertificateTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 max-w-7xl w-full mx-auto">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  const certificates: CertificateDto[] = (data?.data as CertificateDto[]) || [];

  return (
    <div className="p-10 max-w-7xl w-full mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" />
            Certificates
          </h2>
          <p className="text-sm text-outline mt-1">
            {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} issued
          </p>
        </div>
        <Button className="btn-primary-gradient" onClick={() => setCreateOpen(true)}>
          Create Certificate
        </Button>
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Get started by creating your first certificate"
          cta="Create Certificate"
          onCtaClick={() => setCreateOpen(true)}
        />
      ) : (
        <CertificateTable
          certificates={certificates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onGenerate={handleGenerate}
        />
      )}

      <CreateCertificateModal open={createOpen} onOpenChange={setCreateOpen} />
      <EditCertificateModal
        open={editOpen}
        onOpenChange={setEditOpen}
        certificate={selectedCertificate}
      />
      <DeleteCertificateDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        certificate={selectedCertificate}
      />
      <GenerateCertificateModal
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        certificate={selectedCertificate}
      />
    </div>
  );
}
