const MetaInfo = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className="flex mb-4 flex-wrap gap-2">
      <strong className="basis-1/3 font-semibold">{label}</strong>{" "}
      <span>{value}</span>
    </div>
  );
};

export default MetaInfo;
