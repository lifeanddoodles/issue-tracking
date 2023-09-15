function MetaInfo({ label, fullName }: { label: string; fullName?: string }) {
  return (
    <p className="flex my-2">
      <strong className="basis-1/3">{label}</strong> {fullName}
    </p>
  );
}

export default MetaInfo;
