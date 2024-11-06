"use client";

import ContractResults from "./_components/contract-results";

interface IContractResultsProps {
  params: { id: string } | unknown;
}

export default function ContractPage({
  params,
}: IContractResultsProps) {
  const { id } = params as { id: string };  // Cast params to the expected type
  return <ContractResults contractId={id} />;
}
