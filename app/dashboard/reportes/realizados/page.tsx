"use client";
import { Box, Btn } from "@/components/UI";
import Link from "next/link";

export default function Page() {
  const clr = "green";
  const bg: Record<string,string> = { blue:"#3c8dbc",green:"#00a65a",red:"#dd4b39",yellow:"#f39c12",cyan:"#00c0ef",gray:"#aaa",purple:"#605ca8" };
  return (
    <Box title="Prestamos Realizados" color={bg[clr]}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"300px", gap:"16px", textAlign:"center" }}>
        <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:bg[clr]+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px" }}>📋</div>
        <div>
          <h2 style={{ fontSize:"18px", fontWeight:700, color:"#444", margin:"0 0 8px" }}>Prestamos Realizados</h2>
          <p style={{ fontSize:"13px", color:"#888", maxWidth:"400px", lineHeight:1.6 }}>Prestamos otorgados en el periodo</p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <Btn color="green">Continuar</Btn>
          <Link href="/dashboard"><Btn color="gray">Volver al Panel</Btn></Link>
        </div>
      </div>
    </Box>
  );
}
