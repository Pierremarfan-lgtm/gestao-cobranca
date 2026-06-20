import { useState, useMemo } from "react";

// ─── HOOK RESPONSIVO ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [w, setW] = useState(window.innerWidth);
  useState(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  });
  return w < 768;
}

// ─── PALETA ──────────────────────────────────────────────────────────────────
const C = {
  bg:        "#0D1B2A",
  card:      "#1A2D42",
  cardAlt:   "#162436",
  header:    "#0A1622",
  modal:     "#142030",
  input:     "#0F1E2E",
  textWhite: "#FFFFFF",
  textHigh:  "#F0F4FF",
  textMed:   "#C8D6E8",
  textLow:   "#8EABC8",
  textMuted: "#5E7A94",
  border:    "#243B53",
  borderMed: "#2D4A65",
  gold:      "#F0C040",
  goldDark:  "#B8860B",
  goldBg:    "rgba(240,192,64,0.12)",
  red:       "#FF6B6B",
  redDark:   "#CC3333",
  redBg:     "rgba(255,107,107,0.12)",
  green:     "#4CD98A",
  greenDark: "#1A7A4A",
  greenBg:   "rgba(76,217,138,0.12)",
  blue:      "#5BA8FF",
  blueBg:    "rgba(91,168,255,0.12)",
  orange:    "#FFB347",
  orangeBg:  "rgba(255,179,71,0.12)",
  shadow:    "0 4px 20px rgba(0,0,0,0.4)",
};

// ─── DADOS ───────────────────────────────────────────────────────────────────
const CLIENTES_RAW = [
  { id:1,  nome:"Elza Pereira Schoenrock",                        cidade:"Vila Velha",  bairro:"IBES",               endereco:"Av. Nossa Senhora da Penha",       cep:"29108-330", fone:"(27) 99516-3447", saldo:175.67 },
  { id:2,  nome:"Juliane Marley Rogedo",                          cidade:"Vila Velha",  bairro:"Praia de Itaparica", endereco:"Av. Santa Leopoldina",             cep:"29102-041", fone:"(27) 99297-6659", saldo:399.60 },
  { id:3,  nome:"Elzilucia Ambrosio Lucas Simoes",                cidade:"Vila Velha",  bairro:"Praia de Itaparica", endereco:"Av. Santa Leopoldina",             cep:"29102-040", fone:"(27) 99731-5448", saldo:433.38 },
  { id:4,  nome:"Lorraine Sousa Antonio",                         cidade:"Vila Velha",  bairro:"Praia de Itaparica", endereco:"Rua Itaguarana",                   cep:"29102-060", fone:"(27) 98135-9794", saldo:664.00 },
  { id:5,  nome:"Maria Cristina",                                 cidade:"Vila Velha",  bairro:"Praia de Itaparica", endereco:"Rua Itapemirim",                   cep:"29102-090", fone:"(27) 98101-1142", saldo:194.97 },
  { id:6,  nome:"Studio Spa e Beleza Ltda",                       cidade:"Vila Velha",  bairro:"Praia de Itaparica", endereco:"Rua Itaguarana",                   cep:"29102-060", fone:"(27) 99278-5029", saldo:3367.82 },
  { id:7,  nome:"Symone Ferreira dos Santos de Andrade",          cidade:"Vila Velha",  bairro:"Soteco",             endereco:"Av. Ministro Salgado Filho",       cep:"29106-010", fone:"(27) 99783-7060", saldo:183.20 },
  { id:8,  nome:"Daniela Souza do Carmo",                         cidade:"Vila Velha",  bairro:"Soteco",             endereco:"Rua Hélio Ricas",                  cep:"29102-620", fone:"(27) 99284-2069", saldo:3284.70 },
  { id:9,  nome:"Aline Ferreira Barbosa de Melo Lacerda",         cidade:"Vila Velha",  bairro:"Araças",             endereco:"Rua Montevideu",                   cep:"29103-025", fone:"(27) 99789-5084", saldo:5362.20 },
  { id:10, nome:"Simone Alves Brito",                             cidade:"Vila Velha",  bairro:"Araças",             endereco:"Rua Paris",                        cep:"29103-250", fone:"(27) 98800-0655", saldo:748.00 },
  { id:11, nome:"Deborah Quintiliano Clarindo",                   cidade:"Vila Velha",  bairro:"Alecrim",            endereco:"Rua Ana Siqueira",                 cep:"29118-015", fone:"(27) 99718-8980", saldo:202.63 },
  { id:12, nome:"Christina de Sousa Stein",                       cidade:"Vila Velha",  bairro:"Alvorada",           endereco:"Rua Cleto Correa Netto",           cep:"29117-190", fone:"(27) 99244-7820", saldo:798.70 },
  { id:13, nome:"Fernanda Rocha Rosa Aguiar",                     cidade:"Vila Velha",  bairro:"Alvorada",           endereco:"Rua da Madeira",                   cep:"29117-290", fone:"(27) 98895-3919", saldo:1836.00 },
  { id:14, nome:"Claudia de Jesus Pereira",                       cidade:"Vila Velha",  bairro:"Guaranhuns",         endereco:"Av. Sergio Cardoso",               cep:"29103-605", fone:"(27) 99886-0783", saldo:1036.90 },
  { id:15, nome:"Erica Santana Braggio",                          cidade:"Vila Velha",  bairro:"Itapuã",             endereco:"Av. Jair de Andrade",              cep:"29101-701", fone:"(27) 99935-8201", saldo:3755.90 },
  { id:16, nome:"Ilzileia de Mendonca Nascimento",                cidade:"Vila Velha",  bairro:"Itapuã",             endereco:"Rua Waldemar Vercosa Pitanga",     cep:"29101-522", fone:"(27) 98876-8994", saldo:2381.49 },
  { id:17, nome:"Ilzivana Santana da Costa",                      cidade:"Vila Velha",  bairro:"Itapuã",             endereco:"Rua Jair de Andrade",              cep:"29101-701", fone:"(27) 99850-9425", saldo:1263.26 },
  { id:18, nome:"Fabiola da Silva Rosa",                          cidade:"Vila Velha",  bairro:"Glória",             endereco:"Av. Getulio Vargas",               cep:"29122-030", fone:"(27) 99772-0382", saldo:2064.96, renegociado:true },
  { id:19, nome:"Leomary Delvalle",                               cidade:"Vila Velha",  bairro:"Glória",             endereco:"Rua Getulio Vargas",               cep:"29108-030", fone:"(27) 99812-8935", saldo:373.30 },
  { id:20, nome:"Marcon de Souza Caldas",                         cidade:"Vila Velha",  bairro:"Glória",             endereco:"Av. Getulio Vargas",               cep:"29119-090", fone:"(27) 99581-9240", saldo:1224.90 },
  { id:21, nome:"Caroliny de Faria Ramos",                        cidade:"Vila Velha",  bairro:"Jardim Marilândia",  endereco:"Rua Grande Vitória",               cep:"29112-142", fone:"(27) 99625-3088", saldo:357.00 },
  { id:22, nome:"Igor Leonardo Freire Passos",                    cidade:"Vila Velha",  bairro:"Santos Dumont",      endereco:"Rua Ariobaldo Pinto dos Santos",   cep:"29109-340", fone:"(27) 99271-5756", saldo:3763.08 },
  { id:23, nome:"Jackeline Gomes",                                cidade:"Vila Velha",  bairro:"Jardim Guadalajara", endereco:"Rua Tuiti",                        cep:"29109-020", fone:"(27) 98873-4052", saldo:1776.33 },
  { id:24, nome:"Joelma Vila Nova",                               cidade:"Vila Velha",  bairro:"Santa Mônica",       endereco:"Av. João Mendes",                  cep:"29105-200", fone:"(27) 98855-6634", saldo:1147.00 },
  { id:25, nome:"Terezinha de Jesus Nunes de Lima",               cidade:"Vila Velha",  bairro:"Santa Mônica",       endereco:"Av. João Mendes",                  cep:"29105-200", fone:"(27) 98830-3122", saldo:874.60 },
  { id:26, nome:"Thaicynara Auer de Souza Gomes",                 cidade:"Vila Velha",  bairro:"Santa Mônica",       endereco:"Av. João Mendes",                  cep:"29105-640", fone:"(27) 99823-6480", saldo:312.66 },
  { id:27, nome:"Luana Regina de Alencar Chagas",                 cidade:"Vila Velha",  bairro:"Nova Itaparica",     endereco:"Av. Anders",                       cep:"29104-210", fone:"(27) 99807-2485", saldo:3796.00 },
  { id:28, nome:"Paola Miranda",                                  cidade:"Vila Velha",  bairro:"Centro",             endereco:"Rua Antônio Ataíde",               cep:"29100-295", fone:"(27) 99253-5988", saldo:244.00 },
  { id:29, nome:"R. de Souza Salão de Beleza e Comércio Ltda",    cidade:"Vila Velha",  bairro:"Praia da Costa",     endereco:"Rua Anesio Alvarenga",             cep:"29101-230", fone:"(27) 99633-0879", saldo:2017.93 },
  { id:30, nome:"Studio Janaina Figueiredo Ltda",                 cidade:"Vila Velha",  bairro:"Jockey de Itaparica",endereco:"Rua São Luiz",                     cep:"29103-890", fone:"(27) 99529-4171", saldo:503.26 },
  { id:31, nome:"Vera Lucia Goncalves Vieira",                    cidade:"Vila Velha",  bairro:"Rio Marinho",        endereco:"Rua Guaraná",                      cep:"29112-400", fone:"(27) 99987-5866", saldo:1288.00 },
  { id:32, nome:"Diego Melo Monteiro",                            cidade:"Vitória",     bairro:"Centro",             endereco:"Rua Gama Rosa, 231",               cep:"29010-120", fone:"(27) 99500-2323", saldo:1224.80 },
  { id:33, nome:"Patricia de Almeida Coutinho",                   cidade:"Vitória",     bairro:"Centro",             endereco:"Rua São Francisco",                cep:"29015-200", fone:"(27) 99957-1222", saldo:259.45 },
  { id:34, nome:"Simone Aparecida Viturino Moreira",              cidade:"Vitória",     bairro:"Jardim Camburi",     endereco:"Rua Desembargador Eurípedes Q.",    cep:"29090-090", fone:"(27) 99821-3540", saldo:330.80 },
  { id:35, nome:"Espaço Rubi e Estética Ltda",                    cidade:"Vitória",     bairro:"Jardim Camburi",     endereco:"Rua Ademar Luiz Nepomoceno",       cep:"29090-520", fone:"(27) 99911-4053", saldo:394.90 },
  { id:36, nome:"Marquiele Almeida Nascimento",                   cidade:"Vitória",     bairro:"Jardim Camburi",     endereco:"Rua Pedro Busatto",                cep:"29090-470", fone:"(27) 99957-8276", saldo:898.32 },
  { id:37, nome:"Raiane Aparecida da Silva Cabral",               cidade:"Vitória",     bairro:"Jardim Camburi",     endereco:"Rua Milton Manoel dos Santos",     cep:"29090-110", fone:"(27) 99709-3355", saldo:5465.32 },
  { id:38, nome:"Victoria Barbosa Lino da Silva",                 cidade:"Vitória",     bairro:"Jardim Camburi",     endereco:"Rua Agenor Amaro dos Santos",      cep:"29090-010", fone:"(27) 99638-4214", saldo:1075.00 },
  { id:39, nome:"Carla Juliana dos Santos Gaigher",               cidade:"Vitória",     bairro:"Bairro de Fátima",   endereco:"Av. José Rato",                    cep:"29160-790", fone:"(27) 99628-9814", saldo:2158.60 },
  { id:40, nome:"Fabiola Goncalves dos Santos Rodrigues",         cidade:"Vitória",     bairro:"Praia do Canto",     endereco:"Av. Desembargador Santos Neves",   cep:"29055-721", fone:"(27) 99855-0933", saldo:362.33 },
  { id:41, nome:"Tamires Rosário Pereira",                        cidade:"Vitória",     bairro:"Praia do Canto",     endereco:"Av. Desembargador Santos Neves",   cep:"29055-721", fone:"(27) 99855-0933", saldo:2335.14 },
  { id:42, nome:"Instituto de Beleza Belos Cachos Ltda",          cidade:"Vitória",     bairro:"Antônio Honório",    endereco:"Av. Jerônimo Vervloet",            cep:"29070-850", fone:"(27) 99802-9744", saldo:3220.23 },
  { id:43, nome:"Maite Ventura",                                  cidade:"Cariacica",   bairro:"Itacibá",            endereco:"Rua São João",                     cep:"29150-230", fone:"(27) 99905-1798", saldo:1657.37 },
  { id:44, nome:"Gilselene Prado da Silva",                       cidade:"Cariacica",   bairro:"Vila Capixaba",      endereco:"Rua Fundão",                       cep:"29148-140", fone:"(27) 99296-3095", saldo:2754.55 },
  { id:45, nome:"Adriana Lourenço Dias",                          cidade:"Cariacica",   bairro:"Centro",             endereco:"Av. Getúlio Vargas",               cep:"29146-070", fone:"(27) 99826-7496", saldo:1499.96 },
  { id:46, nome:"Sávio Miguel Hair",                              cidade:"Cariacica",   bairro:"Centro",             endereco:"Rua Gil Veloso",                   cep:"29146-160", fone:"(27) 98826-2027", saldo:486.00 },
  { id:47, nome:"Fernanda de Carvalho Silva",                     cidade:"Cariacica",   bairro:"Morada de Santa Fé", endereco:"Rua Dom Pedro II",                 cep:"29143-742", fone:"(27) 98856-7089", saldo:2376.66 },
  { id:48, nome:"Lorena Barbosa Siqueira",                        cidade:"Cariacica",   bairro:"Campo Grande",       endereco:"Rua Maria Frederique",             cep:"29146-590", fone:"(27) 99514-3656", saldo:417.00 },
  { id:49, nome:"Luciene de Jesus Freitas Ribeiro",               cidade:"Cariacica",   bairro:"Campo Grande",       endereco:"Rua Padre José Carlos",            cep:"29146-050", fone:"(27) 99652-7697", saldo:743.00 },
  { id:50, nome:"M.A. Studio de Estética e Beleza Ltda",          cidade:"Cariacica",   bairro:"Campo Grande",       endereco:"Rua São José",                     cep:"29146-560", fone:"(27) 99810-2665", saldo:845.31 },
  { id:51, nome:"Marianna Hemilly Duarte Siqueira",               cidade:"Cariacica",   bairro:"Porto de Santana",   endereco:"Rua Gabino Riuns",                 cep:"29153-010", fone:"(27) 99836-4557", saldo:639.00 },
  { id:52, nome:"Nadira Bernadete Sirgueira da Silva",            cidade:"Cariacica",   bairro:"Santa Luzia",        endereco:"Rua Jerusalém",                    cep:"29156-510", fone:"(27) 99957-7280", saldo:349.10 },
  { id:53, nome:"Josine de Lourdes de Oliveira",                  cidade:"Serra",       bairro:"Manoel Plaza",       endereco:"Rua M",                            cep:"29160-420", fone:"(27) 99711-9818", saldo:264.70 },
  { id:54, nome:"Jocelia Souza",                                  cidade:"Viana",       bairro:"Areinha",            endereco:"Rua Minas Gerais",                 cep:"29137-120", fone:"(27) 99932-0202", saldo:404.06 },
  { id:55, nome:"Rosimeire Goncalves Balieiro Vasconcelos Pinto", cidade:"São Paulo",   bairro:"Brás",               endereco:"Rua Barão de Ladário",             cep:"03010-000", fone:"(27) 99740-0565", saldo:3351.73 },
];

const fmt  = v => v.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
const hoje = () => new Date().toISOString().split("T")[0];
const TIPOS_OC = ["Visita realizada","Contato feito","Não atendeu","Prometeu pagar","Renegociado","Recusa de pagamento","Endereço não encontrado","Mensagem enviada (WhatsApp)"];

function statusInfo(c) {
  if (c.saldo === 0)              return { label:"Quitado",     cor:C.green,  bg:C.greenBg };
  if (c.renegociado || c.ocorrencias?.some(o => o.tipo === "Renegociado"))
                                  return { label:"Renegociado", cor:C.orange, bg:C.orangeBg };
  if (c.ocorrencias?.length > 0) return { label:"Contatado",   cor:C.blue,   bg:C.blueBg };
  return                                 { label:"Pendente",    cor:C.red,    bg:C.redBg };
}

function Badge({ label, cor, bg }) {
  return (
    <span style={{ background:bg, color:cor, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, display:"inline-block", border:`1px solid ${cor}44` }}>
      {label}
    </span>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [clientes, setClientes]     = useState(() => CLIENTES_RAW.map(c => ({ ...c, ocorrencias:[], pagamentos:[] })));
  const [view, setView]             = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [reciboData, setReciboData] = useState(null);
  const [filtro, setFiltro]         = useState("");
  const [filtroCidade, setFiltroCidade] = useState("Todas");
  const [modalOpen, setModalOpen]   = useState(false);
  const [modalTab, setModalTab]     = useState("pagamento");
  const [form, setForm]             = useState({});

  const clienteSel = clientes.find(c => c.id === selectedId);
  const cidades    = ["Todas", ...new Set(CLIENTES_RAW.map(c => c.cidade))];

  const totalGeral    = CLIENTES_RAW.reduce((s, c) => s + c.saldo, 0);
  const totalRecebido = clientes.reduce((s, c) => s + c.pagamentos.reduce((p, pg) => p + pg.valor, 0), 0);
  const saldoAtual    = clientes.reduce((s, c) => s + c.saldo, 0);
  const contatados    = clientes.filter(c => c.ocorrencias.length > 0).length;
  const perc          = totalGeral > 0 ? (totalRecebido / totalGeral * 100).toFixed(1) : 0;

  const filtrados = useMemo(() => clientes.filter(c => {
    const t  = c.nome.toLowerCase().includes(filtro.toLowerCase()) || c.bairro.toLowerCase().includes(filtro.toLowerCase());
    const ci = filtroCidade === "Todas" || c.cidade === filtroCidade;
    return t && ci;
  }), [clientes, filtro, filtroCidade]);

  function abrirModal(tab) {
    setModalTab(tab);
    setForm({ data:hoje(), valorRecebido:"", desconto:"", parcelas:2, obs:"", ocorrencia:"", tipoOcorrencia:TIPOS_OC[0] });
    setModalOpen(true);
  }
  const fp = s => parseFloat((s || "").replace(",", ".")) || 0;

  function salvarPagamento() {
    const val = fp(form.valorRecebido), desc = fp(form.desconto);
    if (val <= 0 && desc <= 0) { alert("Informe valor recebido ou desconto."); return; }
    const abat = val + desc;
    const rec  = { id:Date.now(), data:form.data, valor:val, desconto:desc, abatimento:abat, obs:form.obs };
    const saldoAntes = clienteSel.saldo;
    setClientes(prev => prev.map(c => c.id !== selectedId ? c : { ...c, saldo:Math.max(0, c.saldo - abat), pagamentos:[...c.pagamentos, rec] }));
    setReciboData({ ...rec, cliente:clienteSel, saldoAntes, saldoDepois:Math.max(0, saldoAntes - abat) });
    setModalOpen(false); setView("recibo");
  }
  function salvarOcorrencia() {
    if (!form.ocorrencia?.trim()) { alert("Descreva a ocorrência."); return; }
    const oc = { id:Date.now(), data:form.data, tipo:form.tipoOcorrencia, texto:form.ocorrencia };
    setClientes(prev => prev.map(c => c.id !== selectedId ? c : { ...c, ocorrencias:[oc, ...c.ocorrencias] }));
    setModalOpen(false);
  }
  function parcEstimada() {
    const entrada = fp(form.valorRecebido);
    return clienteSel ? Math.max(0, clienteSel.saldo - entrada) / (form.parcelas || 1) : 0;
  }

  // ── Safe area bottom para iPhones com notch ──
  const safeBottom = "env(safe-area-inset-bottom, 0px)";
  const navH       = isMobile ? 60 : 0;

  if (view === "recibo" && reciboData)
    return <Recibo data={reciboData} onVoltar={() => setView("cliente")} isMobile={isMobile} />;
  if (view === "cliente" && clienteSel)
    return <ClienteDetalhe cliente={clienteSel} onVoltar={() => { setView("lista"); setSelectedId(null); }} onModal={abrirModal} isMobile={isMobile} navH={navH} modalOpen={modalOpen} setModalOpen={setModalOpen} modalTab={modalTab} setModalTab={setModalTab} form={form} setForm={setForm} salvarPagamento={salvarPagamento} salvarOcorrencia={salvarOcorrencia} parcEstimada={parcEstimada} />;

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh", minHeight:"100dvh", color:C.textHigh, paddingBottom:`calc(${navH}px + ${safeBottom})` }}>

      {/* ── TOPBAR (desktop) / mini header (mobile) ── */}
      {!isMobile ? (
        <div style={{ background:C.header, borderBottom:`1px solid ${C.border}`, padding:"0 24px", height:58, display:"flex", alignItems:"center", gap:16, boxShadow:"0 2px 12px rgba(0,0,0,0.5)", position:"sticky", top:0, zIndex:100 }}>
          <div>
            <div style={{ fontSize:10, color:C.gold, letterSpacing:3, textTransform:"uppercase", fontWeight:700 }}>Bio Ozônio</div>
            <div style={{ fontSize:17, fontWeight:800, color:C.textWhite }}>Sistema de Cobrança</div>
          </div>
          <div style={{ flex:1 }} />
          <span style={{ fontSize:12, color:C.textMed }}>Viviane · {new Date().toLocaleDateString("pt-BR")}</span>
          {["dashboard","lista"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ background:view===v?C.gold:"transparent", color:view===v?"#000":C.gold, border:`1px solid ${C.gold}`, borderRadius:7, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer", minHeight:44 }}>
              {v === "dashboard" ? "📊 Resumo" : "📋 Clientes"}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ background:C.header, borderBottom:`1px solid ${C.border}`, padding:`calc(env(safe-area-inset-top,0px) + 10px) 16px 10px`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <div>
            <div style={{ fontSize:9, color:C.gold, letterSpacing:2, textTransform:"uppercase", fontWeight:700 }}>Bio Ozônio</div>
            <div style={{ fontSize:15, fontWeight:800, color:C.textWhite }}>Sistema de Cobrança</div>
          </div>
          <div style={{ fontSize:11, color:C.textLow }}>Viviane · {new Date().toLocaleDateString("pt-BR")}</div>
        </div>
      )}

      {/* ── CONTEÚDO ── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:isMobile ? "16px 12px" : "24px 20px" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && <>
          {/* KPIs — 2 col em mobile, 4 em desktop */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:isMobile?10:14, marginBottom:isMobile?16:22 }}>
            {[
              { label:"Total Inadimplente", value:fmt(totalGeral),      cor:C.red,   icon:"⚠️" },
              { label:"Total Recebido",     value:fmt(totalRecebido),   cor:C.green, icon:"✅" },
              { label:"Saldo em Aberto",    value:fmt(saldoAtual),      cor:C.gold,  icon:"💰" },
              { label:"Contatados",         value:`${contatados}/55`,   cor:C.blue,  icon:"📞" },
            ].map((k, i) => (
              <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderLeft:`4px solid ${k.cor}`, borderRadius:10, padding:isMobile?"12px 12px":"18px 20px", boxShadow:C.shadow }}>
                <div style={{ fontSize:isMobile?18:24, marginBottom:4 }}>{k.icon}</div>
                <div style={{ fontSize:isMobile?10:12, color:C.textMed, fontWeight:600, marginBottom:2 }}>{k.label}</div>
                <div style={{ fontSize:isMobile?15:20, fontWeight:900, color:k.cor }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Barra de progresso */}
          <div style={{ background:C.card, borderRadius:10, padding:isMobile?"14px 16px":"18px 22px", marginBottom:isMobile?16:20, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontWeight:700, color:C.textWhite, fontSize:isMobile?13:14 }}>Progresso de Recuperação</span>
              <span style={{ fontWeight:900, color:C.green, fontSize:isMobile?15:16 }}>{perc}%</span>
            </div>
            <div style={{ background:C.cardAlt, borderRadius:99, height:10, overflow:"hidden", border:`1px solid ${C.border}` }}>
              <div style={{ width:`${perc}%`, background:`linear-gradient(90deg,${C.greenDark},${C.green})`, height:"100%", borderRadius:99 }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:12 }}>
              <span style={{ color:C.textMed }}>Recebido: <strong style={{ color:C.green }}>{fmt(totalRecebido)}</strong></span>
              <span style={{ color:C.textMed }}>Total: <strong style={{ color:C.textHigh }}>{fmt(totalGeral)}</strong></span>
            </div>
          </div>

          {/* Maiores devedores + ocorrências — empilhados no mobile */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:isMobile?14:18 }}>
            <div style={{ background:C.card, borderRadius:10, padding:isMobile?"14px 14px":"20px", border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
              <div style={{ fontWeight:800, color:C.textWhite, marginBottom:12, fontSize:13, paddingBottom:8, borderBottom:`1px solid ${C.border}` }}>
                🔴 <span style={{ color:C.red }}>Maiores Saldos</span>
              </div>
              {[...clientes].sort((a, b) => b.saldo - a.saldo).slice(0, isMobile?5:6).map((c, i) => (
                <div key={c.id} onClick={() => { setSelectedId(c.id); setView("cliente"); }}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:`1px solid ${C.border}`, cursor:"pointer", minHeight:44 }}>
                  <span style={{ background:i<3?C.red:C.border, color:"#fff", borderRadius:6, padding:"2px 7px", fontSize:11, fontWeight:800, minWidth:24, textAlign:"center", flexShrink:0 }}>{i+1}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.textWhite, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.nome.split(" ").slice(0,3).join(" ")}</div>
                    <div style={{ fontSize:11, color:C.textLow }}>{c.bairro} · {c.cidade}</div>
                  </div>
                  <div style={{ fontWeight:800, color:C.red, fontSize:13, flexShrink:0 }}>{fmt(c.saldo)}</div>
                </div>
              ))}
              <button onClick={() => setView("lista")} style={{ ...bOutline, marginTop:12, width:"100%", textAlign:"center", display:"block", minHeight:44 }}>
                Ver todos os 55 clientes →
              </button>
            </div>

            <div style={{ background:C.card, borderRadius:10, padding:isMobile?"14px 14px":"20px", border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
              <div style={{ fontWeight:800, color:C.textWhite, marginBottom:12, fontSize:13, paddingBottom:8, borderBottom:`1px solid ${C.border}` }}>
                📋 <span style={{ color:C.blue }}>Últimas Ocorrências</span>
              </div>
              {clientes.filter(c => c.ocorrencias.length > 0).sort((a, b) => b.ocorrencias[0].id - a.ocorrencias[0].id).slice(0, 5).map(c => (
                <div key={c.id} onClick={() => { setSelectedId(c.id); setView("cliente"); }}
                  style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}`, cursor:"pointer", minHeight:44 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.textWhite }}>{c.nome.split(" ").slice(0, 2).join(" ")}</span>
                    <span style={{ fontSize:11, color:C.textLow }}>{c.ocorrencias[0].data}</span>
                  </div>
                  <Badge label={c.ocorrencias[0].tipo} cor={C.blue} bg={C.blueBg} />
                  <div style={{ fontSize:12, color:C.textMed, marginTop:3 }}>{c.ocorrencias[0].texto.slice(0, 55)}{c.ocorrencias[0].texto.length > 55 ? "…" : ""}</div>
                </div>
              ))}
              {clientes.filter(c => c.ocorrencias.length > 0).length === 0 &&
                <div style={{ color:C.textLow, fontSize:13, textAlign:"center", padding:20 }}>Nenhuma ocorrência ainda.</div>}
            </div>
          </div>
        </>}

        {/* LISTA */}
        {view === "lista" && <>
          <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <input value={filtro} onChange={e => setFiltro(e.target.value)}
              placeholder="🔍  Buscar nome ou bairro..."
              style={{ flex:1, minWidth:160, ...iSt }} />
            <select value={filtroCidade} onChange={e => setFiltroCidade(e.target.value)} style={{ ...iSt, minWidth:120 }}>
              {cidades.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ background:C.blueBg, border:`1px solid ${C.blue}44`, borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:700, color:C.blue, marginBottom:12 }}>
            {filtrados.length} clientes · {fmt(filtrados.reduce((s, c) => s + c.saldo, 0))}
          </div>
          <div style={{ display:"grid", gap:8 }}>
            {filtrados.map(c => {
              const st = statusInfo(c);
              return (
                <div key={c.id} onClick={() => { setSelectedId(c.id); setView("cliente"); }}
                  style={{ background:C.card, border:`1px solid ${C.border}`, borderLeft:`4px solid ${st.cor}`, borderRadius:8, padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, boxShadow:C.shadow, minHeight:64 }}>
                  <div style={{ width:36, height:36, borderRadius:99, background:st.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:st.cor, border:`1.5px solid ${st.cor}44`, flexShrink:0 }}>
                    {c.nome[0]}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:C.textWhite, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.nome}</div>
                    <div style={{ fontSize:11, color:C.textLow }}>{c.bairro} · {c.cidade}</div>
                    {c.ocorrencias.length > 0 && <div style={{ fontSize:10, color:C.textMed, marginTop:1 }}>📝 {c.ocorrencias[0].tipo}</div>}
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontWeight:900, color:C.red, fontSize:14 }}>{fmt(c.saldo)}</div>
                    <Badge label={st.label} cor={st.cor} bg={st.bg} />
                  </div>
                  <span style={{ color:C.textLow, fontSize:18, flexShrink:0 }}>›</span>
                </div>
              );
            })}
          </div>
        </>}
      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      {isMobile && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:C.header, borderTop:`1px solid ${C.border}`, display:"flex", paddingBottom:safeBottom }}>
          {[["dashboard","📊","Resumo"],["lista","📋","Clientes"]].map(([v, icon, label]) => (
            <button key={v} onClick={() => setView(v)} style={{ flex:1, background:"none", border:"none", padding:"10px 0 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:22 }}>{icon}</span>
              <span style={{ fontSize:10, fontWeight:700, color:view===v?C.gold:C.textLow }}>{label}</span>
              {view === v && <div style={{ width:20, height:2, background:C.gold, borderRadius:2 }} />}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

// ─── DETALHE DO CLIENTE ──────────────────────────────────────────────────────
function ClienteDetalhe({ cliente, onVoltar, onModal, isMobile, navH, modalOpen, setModalOpen, modalTab, setModalTab, form, setForm, salvarPagamento, salvarOcorrencia, parcEstimada }) {
  const st = statusInfo(cliente);
  const safeBottom = "env(safe-area-inset-bottom, 0px)";
  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100dvh", color:C.textHigh, paddingBottom:`calc(${navH}px + ${safeBottom})` }}>
      <div style={{ background:C.header, borderBottom:`1px solid ${C.border}`, padding:isMobile?`calc(env(safe-area-inset-top,0px) + 10px) 14px 10px`:"0 22px", height:isMobile?"auto":56, display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100 }}>
        <button onClick={onVoltar} style={{ ...bOutline, padding:"8px 14px", minHeight:40, flexShrink:0 }}>← Voltar</button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:isMobile?13:15, color:C.textWhite, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cliente.nome}</div>
          <div style={{ fontSize:11, color:C.textLow }}>{cliente.bairro} · {cliente.cidade}</div>
        </div>
        <Badge label={st.label} cor={st.cor} bg={st.bg} />
      </div>

      <div style={{ maxWidth:720, margin:"0 auto", padding:isMobile?"14px 12px":"22px" }}>
        {/* Saldo card */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:isMobile?"16px":"22px", marginBottom:14, boxShadow:C.shadow }}>
          <div style={{ fontSize:10, color:C.textLow, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Saldo Devedor Atual</div>
          <div style={{ fontSize:isMobile?28:36, fontWeight:900, color:C.red, lineHeight:1.1, marginBottom:10 }}>{fmt(cliente.saldo)}</div>
          <div style={{ fontSize:12, color:C.textMed, marginBottom:2 }}>📍 {cliente.endereco} · CEP {cliente.cep}</div>
          <div style={{ fontSize:12, color:C.textMed, marginBottom:16 }}>📞 {cliente.fone}</div>
          {/* Botões de ação */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr", gap:8 }}>
            <button onClick={() => { setModalTab("pagamento"); setForm({ data:hoje(), valorRecebido:"", desconto:"", parcelas:2, obs:"", ocorrencia:"", tipoOcorrencia:TIPOS_OC[0] }); setModalOpen(true); }} style={{ ...bPrimary, minHeight:48, marginBottom:0 }}>💰 Registrar Pagamento</button>
            <button onClick={() => { setModalTab("negociacao"); setForm({ data:hoje(), valorRecebido:"", desconto:"", parcelas:2, obs:"", ocorrencia:"", tipoOcorrencia:TIPOS_OC[0] }); setModalOpen(true); }} style={{ ...bPrimary, background:C.goldDark, minHeight:48, marginBottom:0 }}>🤝 Negociar Parcelamento</button>
            <button onClick={() => { setModalTab("ocorrencia"); setForm({ data:hoje(), valorRecebido:"", desconto:"", parcelas:2, obs:"", ocorrencia:"", tipoOcorrencia:TIPOS_OC[0] }); setModalOpen(true); }} style={{ ...bOutline, minHeight:48, display:"block", width:"100%", textAlign:"center" }}>📝 Registrar Ocorrência</button>
          </div>
        </div>

        {/* Pagamentos */}
        {cliente.pagamentos.length > 0 && (
          <div style={{ background:C.card, borderRadius:12, padding:isMobile?"14px":"20px", marginBottom:14, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
            <div style={{ fontWeight:800, color:C.green, marginBottom:12, fontSize:13 }}>✅ Histórico de Pagamentos</div>
            <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:400 }}>
                <thead>
                  <tr>
                    {["Data","Recebido","Desconto","Abatimento","Obs"].map(h => (
                      <th key={h} style={{ padding:"7px 8px", textAlign:"left", color:C.textLow, fontWeight:700, fontSize:10, textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cliente.pagamentos.map((p, i) => (
                    <tr key={p.id} style={{ background:i%2===0?C.card:C.cardAlt }}>
                      <td style={{ padding:"8px", color:C.textHigh }}>{p.data}</td>
                      <td style={{ padding:"8px", color:C.green, fontWeight:700 }}>{fmt(p.valor)}</td>
                      <td style={{ padding:"8px", color:C.gold }}>{fmt(p.desconto)}</td>
                      <td style={{ padding:"8px", color:C.textWhite, fontWeight:700 }}>{fmt(p.abatimento)}</td>
                      <td style={{ padding:"8px", color:C.textMed }}>{p.obs||"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ocorrências */}
        <div style={{ background:C.card, borderRadius:12, padding:isMobile?"14px":"20px", border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
          <div style={{ fontWeight:800, color:C.blue, marginBottom:12, fontSize:13 }}>📋 Ocorrências de Cobrança</div>
          {cliente.ocorrencias.length === 0 && (
            <div style={{ textAlign:"center", padding:"20px 10px", color:C.textLow, fontSize:13 }}>
              Nenhuma ocorrência ainda.<br />
              <span style={{ fontSize:12, color:C.textMuted }}>Use os botões acima para registrar.</span>
            </div>
          )}
          {cliente.ocorrencias.map(o => (
            <div key={o.id} style={{ background:C.cardAlt, borderRadius:8, padding:"12px 14px", marginBottom:10, border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, gap:8 }}>
                <Badge label={o.tipo} cor={C.blue} bg={C.blueBg} />
                <span style={{ fontSize:11, color:C.textLow, fontWeight:600, flexShrink:0 }}>{o.data}</span>
              </div>
              <div style={{ fontSize:13, color:C.textHigh, lineHeight:1.5 }}>{o.texto}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL ── */}
      {modalOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:isMobile?"flex-end":"center", justifyContent:"center", zIndex:999, padding:isMobile?0:16 }}>
          <div style={{ background:C.modal, border:`1px solid ${C.borderMed}`, borderRadius:isMobile?"18px 18px 0 0":"14px", width:"100%", maxWidth:480, overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,.6)", maxHeight:isMobile?"90dvh":"90vh", display:"flex", flexDirection:"column" }}>
            {isMobile && <div style={{ width:36, height:4, background:C.borderMed, borderRadius:2, margin:"10px auto 0" }} />}
            <div style={{ background:C.header, borderBottom:`1px solid ${C.border}`, padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div>
                <div style={{ color:C.textWhite, fontWeight:800, fontSize:14 }}>Registrar Ação</div>
                <div style={{ color:C.textMed, fontSize:11 }}>{cliente.nome.split(" ").slice(0,3).join(" ")} · <span style={{ color:C.red, fontWeight:700 }}>{fmt(cliente.saldo)}</span></div>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background:C.card, border:`1px solid ${C.border}`, color:C.textMed, borderRadius:8, width:36, height:36, fontSize:18, cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
              {[["pagamento","💰 Pagto"],["negociacao","🤝 Parcela"],["ocorrencia","📝 Ocorr."]].map(([t, l]) => (
                <button key={t} onClick={() => setModalTab(t)} style={{ flex:1, padding:"11px 2px", background:"none", border:"none", borderBottom:modalTab===t?`3px solid ${C.gold}`:"3px solid transparent", color:modalTab===t?C.gold:C.textMed, fontWeight:700, fontSize:11, cursor:"pointer" }}>{l}</button>
              ))}
            </div>
            <div style={{ padding:"16px 18px", overflowY:"auto", paddingBottom:`calc(16px + ${safeBottom})` }}>
              <label style={lbl}>Data</label>
              <input type="date" value={form.data || hoje()} onChange={e => setForm(p => ({ ...p, data:e.target.value }))} style={iSt} />
              {modalTab === "pagamento" && <>
                <label style={lbl}>Valor Recebido (R$)</label>
                <input placeholder="0,00" inputMode="decimal" value={form.valorRecebido||""} onChange={e => setForm(p => ({ ...p, valorRecebido:e.target.value }))} style={iSt} />
                <label style={lbl}>Desconto / Abatimento (R$)</label>
                <input placeholder="0,00" inputMode="decimal" value={form.desconto||""} onChange={e => setForm(p => ({ ...p, desconto:e.target.value }))} style={iSt} />
                <label style={lbl}>Observação</label>
                <textarea value={form.obs||""} onChange={e => setForm(p => ({ ...p, obs:e.target.value }))} style={{ ...iSt, height:70, resize:"none" }} />
                <button onClick={salvarPagamento} style={{ ...bPrimary, minHeight:50 }}>💾 Salvar e Gerar Recibo</button>
              </>}
              {modalTab === "negociacao" && <>
                <label style={lbl}>Entrada (opcional)</label>
                <input placeholder="0,00" inputMode="decimal" value={form.valorRecebido||""} onChange={e => setForm(p => ({ ...p, valorRecebido:e.target.value }))} style={iSt} />
                <label style={lbl}>Número de Parcelas</label>
                <select value={form.parcelas||2} onChange={e => setForm(p => ({ ...p, parcelas:parseInt(e.target.value) }))} style={iSt}>
                  {[1,2,3,4,5,6,8,10,12].map(n => <option key={n} value={n}>{n}x</option>)}
                </select>
                <div style={{ background:C.goldBg, border:`1px solid ${C.gold}44`, borderRadius:8, padding:14, marginBottom:14 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <div><div style={{ fontSize:10, color:C.textLow, fontWeight:600, marginBottom:3 }}>SALDO ATUAL</div><div style={{ fontSize:16, fontWeight:900, color:C.red }}>{fmt(cliente.saldo)}</div></div>
                    <div><div style={{ fontSize:10, color:C.textLow, fontWeight:600, marginBottom:3 }}>PARCELA ESTIMADA</div><div style={{ fontSize:16, fontWeight:900, color:C.gold }}>{fmt(parcEstimada())}</div></div>
                  </div>
                </div>
                <label style={lbl}>Condições acordadas</label>
                <textarea value={form.obs||""} onChange={e => setForm(p => ({ ...p, obs:e.target.value }))} placeholder="Ex: paga R$300 todo dia 5…" style={{ ...iSt, height:60, resize:"none" }} />
                <button onClick={salvarPagamento} style={{ ...bPrimary, minHeight:50 }}>✅ Confirmar Negociação</button>
              </>}
              {modalTab === "ocorrencia" && <>
                <label style={lbl}>Tipo de Ocorrência</label>
                <select value={form.tipoOcorrencia||TIPOS_OC[0]} onChange={e => setForm(p => ({ ...p, tipoOcorrencia:e.target.value }))} style={iSt}>
                  {TIPOS_OC.map(t => <option key={t}>{t}</option>)}
                </select>
                <label style={lbl}>Descrição</label>
                <textarea value={form.ocorrencia||""} onChange={e => setForm(p => ({ ...p, ocorrencia:e.target.value }))} placeholder="Descreva o que aconteceu…" style={{ ...iSt, height:100, resize:"none" }} />
                <button onClick={salvarOcorrencia} style={{ ...bPrimary, minHeight:50 }}>📝 Registrar Ocorrência</button>
              </>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RECIBO ──────────────────────────────────────────────────────────────────
function Recibo({ data, onVoltar, isMobile }) {
  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100dvh", display:"flex", flexDirection:"column", alignItems:"center", padding:isMobile?"12px":"28px", paddingTop:isMobile?"calc(env(safe-area-inset-top,0px) + 12px)":"28px" }}>
      <div style={{ background:"#fff", borderRadius:14, width:"100%", maxWidth:500, overflow:"hidden", boxShadow:"0 12px 50px rgba(0,0,0,.4)" }}>
        <div style={{ background:C.header, padding:"20px 24px", textAlign:"center", borderBottom:`3px solid ${C.gold}` }}>
          <div style={{ fontSize:9, color:C.gold, letterSpacing:4, textTransform:"uppercase", fontWeight:700 }}>Bio Ozônio</div>
          <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginTop:4 }}>RECIBO DE PAGAMENTO</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:3 }}>N° {String(data.id).slice(-6)} · {data.data}</div>
        </div>
        <div style={{ padding:"20px 22px", background:"#fff", color:"#1A1A2E" }}>
          <div style={{ background:"#F4F6FA", borderRadius:8, padding:12, marginBottom:16, border:"1px solid #DDE3EC" }}>
            <div style={{ fontSize:10, color:"#6B7280", textTransform:"uppercase", fontWeight:600 }}>Recebemos de</div>
            <div style={{ fontSize:15, fontWeight:800, color:"#1A1A2E", marginTop:3 }}>{data.cliente.nome}</div>
            <div style={{ fontSize:12, color:"#4A5568" }}>{data.cliente.endereco} · {data.cliente.cidade}</div>
            <div style={{ fontSize:12, color:"#4A5568" }}>{data.cliente.fone}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
            {[
              { l:"Saldo Anterior",     v:fmt(data.saldoAntes),  c:"#1A1A2E" },
              { l:"Valor Recebido",     v:fmt(data.valor),       c:"#1A7A4A" },
              { l:"Desconto Concedido", v:fmt(data.desconto),    c:"#B8860B" },
              { l:"Total Abatido",      v:fmt(data.abatimento),  c:"#1A7A4A" },
            ].map((item, i) => (
              <div key={i} style={{ background:"#F4F6FA", borderRadius:6, padding:"10px 11px", border:"1px solid #DDE3EC" }}>
                <div style={{ fontSize:9, color:"#6B7280", textTransform:"uppercase", fontWeight:600 }}>{item.l}</div>
                <div style={{ fontSize:14, fontWeight:800, color:item.c, marginTop:2 }}>{item.v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"#FDECEA", border:"2px solid #FFAAAA", borderRadius:8, padding:14, marginBottom:14, textAlign:"center" }}>
            <div style={{ fontSize:10, color:"#C0392B", textTransform:"uppercase", fontWeight:700, letterSpacing:1 }}>Novo Saldo Devedor</div>
            <div style={{ fontSize:26, fontWeight:900, color:"#C0392B", marginTop:3 }}>{fmt(data.saldoDepois)}</div>
          </div>
          {data.obs && <div style={{ background:"#FFFDE7", border:"1px solid #F9C930", borderRadius:6, padding:11, fontSize:12, color:"#7A5000", marginBottom:14 }}><strong>Obs:</strong> {data.obs}</div>}
          <div style={{ textAlign:"center", paddingTop:14, borderTop:"1px dashed #DDE3EC" }}>
            <div style={{ width:180, borderTop:"1px solid #1A1A2E", margin:"16px auto 0", paddingTop:7, fontSize:11, color:"#6B7280" }}>Assinatura do Cliente</div>
            <div style={{ fontSize:10, color:"#9CA3AF", marginTop:8 }}>Emitido em {new Date().toLocaleDateString("pt-BR")} — Bio Ozônio</div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:10, marginTop:16, width:"100%", maxWidth:500 }}>
        <button onClick={onVoltar} style={{ ...bOutline, flex:1, textAlign:"center", minHeight:48 }}>← Voltar</button>
        <button onClick={() => window.print()} style={{ ...bPrimary, flex:1, marginBottom:0, minHeight:48 }}>🖨️ Imprimir</button>
      </div>
    </div>
  );
}

// ─── ESTILOS BASE ────────────────────────────────────────────────────────────
const lbl     = { display:"block", fontSize:10, color:C.textLow, fontWeight:700, marginBottom:5, textTransform:"uppercase", letterSpacing:.6 };
const iSt     = { display:"block", width:"100%", boxSizing:"border-box", background:C.input, border:`1.5px solid ${C.borderMed}`, borderRadius:8, padding:"12px 13px", color:C.textWhite, fontSize:16, marginBottom:12, outline:"none", fontFamily:"inherit" };
const bPrimary= { background:C.gold, color:"#000", border:"none", borderRadius:8, padding:"12px 18px", fontSize:14, fontWeight:800, cursor:"pointer", display:"block", width:"100%", textAlign:"center", marginBottom:8 };
const bOutline= { background:"transparent", color:C.gold, border:`1.5px solid ${C.gold}`, borderRadius:8, padding:"11px 16px", fontSize:13, fontWeight:700, cursor:"pointer", display:"inline-block" };
