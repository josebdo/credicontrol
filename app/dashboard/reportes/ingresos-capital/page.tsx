"use client";
import { Box, Btn } from "@/components/UI";
import Link from "next/link";

export default function Page() {
  const clr = "yellow";
  const bg: Record<string,string> = { blue:"#3c8dbc",green:"#00a65a",red:"#dd4b39",yellow:"#f39c12",cyan:"#00c0ef",gray:"#aaa",purple:"#605ca8" };
  return (
    <Box title="Ingresos y Capital" color={bg[clr]}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"300px", gap:"16px", textAlign:"center" }}>
        <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:bg[clr]+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px" }}>📋</div>
        <div>
          <h2 style={{ fontSize:"18px", fontWeight:700, color:"#444", margin:"0 0 8px" }}>Ingresos y Capital</h2>
          <p style={{ fontSize:"13px", color:"#888", maxWidth:"400px", lineHeight:1.6 }}>Desglose de capital e intereses cobrados</p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <Btn color="yellow">Continuar</Btn>
          <Link href="/dashboard"><Btn color="gray">Volver al Panel</Btn></Link>
        </div>
      </div>
    </Box>
  );
}
