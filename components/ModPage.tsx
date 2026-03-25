// Shared page wrapper with box styling
interface Props {
  title:    string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}
export default function ModPage({ title, children, actions }: Props) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"15px" }}>
      {actions && (
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" as const }}>
          {actions}
        </div>
      )}
      <div style={{ background:"#fff", borderRadius:"3px", boxShadow:"0 1px 1px rgba(0,0,0,0.1)", overflow:"hidden" }}>
        <div style={{ padding:"10px 15px", borderBottom:"3px solid #3c8dbc", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h3 style={{ fontSize:"16px", fontWeight:600, color:"#444", margin:0 }}>{title}</h3>
        </div>
        <div style={{ padding:"15px" }}>{children}</div>
      </div>
    </div>
  );
}
