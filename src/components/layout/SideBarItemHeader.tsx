interface SideBarItemHeaderProps {
  label: string;
}

const SideBarItemHeader = ({ label }: SideBarItemHeaderProps) => {
  return (
    <div className="mb-1 px-2.5 pt-1 xl:px-3">
      <span className="text-muted-foreground/70 3xl:text-[12px] text-[10px] font-semibold tracking-[0.08em] uppercase xl:text-[11px]">
        {label}
      </span>
    </div>
  );
};

export default SideBarItemHeader;
