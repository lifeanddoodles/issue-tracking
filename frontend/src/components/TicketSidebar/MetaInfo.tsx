const MetaInfo = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className="flex flex-row mb-4 gap-2 w-full flex-wrap">
      <strong className="basis-full max-w-1/3 shrink-0 sm:basis-1/3 md:basis-full lg:basis-1/3 font-semibold">
        {label}
      </strong>{" "}
      <span className="w-full max-w-xs basis-full max-w-2/3 shrink grow sm:basis-2/3 md:basis-full lg:basis-2/3">
        {value}
      </span>
    </div>
  );
};

export default MetaInfo;
