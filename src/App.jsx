import { useState, useMemo, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ─── FIREBASE ────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBSDQoOhkmapE-T4_NfPFWjvRgLP6Uv74g",
  authDomain: "gestao-cobranca-c8191.firebaseapp.com",
  projectId: "gestao-cobranca-c8191",
  storageBucket: "gestao-cobranca-c8191.firebasestorage.app",
  messagingSenderId: "492957379862",
  appId: "1:492957379862:web:39d62facf7cb5acacaf437"
};
const fbApp = initializeApp(firebaseConfig);
const db    = getFirestore(fbApp);

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
  const [usuario, setUsuario]       = useState(null);
  const [clientes, setClientes]     = useState(() => CLIENTES_RAW.map(c => ({ ...c, ocorrencias:[], pagamentos:[] })));
  const [vendedores, setVendedores] = useState([{ nome:"Viviane", senha:"viviane123" }]);
  const [senhaGestor, setSenhaGestor] = useState("bio2024");
  const [view, setView]             = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [reciboData, setReciboData] = useState(null);
  const [filtro, setFiltro]         = useState("");
  const [filtroCidade, setFiltroCidade] = useState("Todas");
  const [filtroVendedor, setFiltroVendedor] = useState("Todos");
  const [modalOpen, setModalOpen]   = useState(false);
  const [modalTab, setModalTab]     = useState("pagamento");
  const [form, setForm]             = useState({});
  const [carregando, setCarregando] = useState(true);

  // ── Carrega dados do Firebase ──
  useEffect(() => {
    const timeout = setTimeout(() => setCarregando(false), 8000);
    async function carregar() {
      try {
        const snap = await getDoc(doc(db, "cobranca-viviane", "dados"));
        if (snap.exists()) {
          const dados = snap.data().clientes || [];
          // Vendedores — se não existir no Firebase usa o padrão
          const vends = snap.data().vendedores;
          if (vends && Array.isArray(vends) && vends.length > 0) {
            setVendedores(vends);
          }
          // Senha do gestor
          if (snap.data().senhaGestor) setSenhaGestor(snap.data().senhaGestor);
          // Clientes
          const fixos = CLIENTES_RAW.map(c => {
            const salvo = dados.find(s => s.id === c.id);
            return salvo ? { ...c, saldo:salvo.saldo, ocorrencias:salvo.ocorrencias||[], pagamentos:salvo.pagamentos||[], acordos:salvo.acordos||[], vendedor:salvo.vendedor||"Viviane" } : { ...c, ocorrencias:[], pagamentos:[], acordos:[], vendedor:"Viviane" };
          });
          const novos = dados.filter(s => !CLIENTES_RAW.find(c => c.id === s.id));
          setClientes([...fixos, ...novos]);
        }
      } catch(e) {
        console.error("Firebase erro:", e);
      } finally {
        clearTimeout(timeout);
        setCarregando(false);
      }
    }
    carregar();
    return () => clearTimeout(timeout);
  }, []);

  // ── Salva dados no Firebase ──
  async function salvarFirebase(novosClientes, novosVendedores, novaSenha) {
    try {
      await setDoc(doc(db, "cobranca-viviane", "dados"), {
        clientes: novosClientes.map(c => ({ id:c.id, nome:c.nome, cidade:c.cidade, bairro:c.bairro, endereco:c.endereco, cep:c.cep, fone:c.fone, saldo:c.saldo, vendedor:c.vendedor||"Viviane", ocorrencias:c.ocorrencias, pagamentos:c.pagamentos, acordos:c.acordos||[] })),
        vendedores: novosVendedores || vendedores,
        senhaGestor: novaSenha || senhaGestor,
        atualizado: new Date().toISOString()
      });
    } catch(e) { console.error(e); }
  }

  function atualizarClientes(fn) {
    setClientes(prev => {
      const novo = fn(prev);
      salvarFirebase(novo, vendedores);
      return novo;
    });
  }

  function adicionarVendedor(nome, senha) {
    const novos = [...vendedores, { nome, senha }];
    setVendedores(novos);
    salvarFirebase(clientes, novos);
  }

  function adicionarCliente(dados) {
    const novoId = Date.now();
    const novo = { id:novoId, nome:dados.nome, cidade:dados.cidade, bairro:dados.bairro, endereco:dados.endereco, cep:dados.cep, fone:dados.fone, saldo:parseFloat((dados.saldo||"0").replace(",","."))||0, vendedor:dados.vendedor||vendedores[0]?.nome||"Viviane", ocorrencias:[], pagamentos:[] };
    atualizarClientes(prev => [...prev, novo]);
    setView("lista");
  }

  const clienteSel = clientes.find(c => c.id === selectedId);
  const cidades    = ["Todas", ...new Set(clientes.map(c => c.cidade))];

  // Vendedor só vê seus próprios clientes (usa optional chaining para quando usuario=null)
  const clientesVisiveis = usuario?.perfil === "vendedor"
    ? clientes.filter(c => c.vendedor === usuario.nome)
    : clientes;

  const totalGeral    = clientesVisiveis.reduce((s, c) => s + c.saldo + c.pagamentos.reduce((p, pg) => p + pg.abatimento, 0), 0);
  const totalRecebido = clientesVisiveis.reduce((s, c) => s + c.pagamentos.reduce((p, pg) => p + pg.valor, 0), 0);
  const saldoAtual    = clientesVisiveis.reduce((s, c) => s + c.saldo, 0);
  const contatados    = clientesVisiveis.filter(c => c.ocorrencias.length > 0).length;
  const perc          = totalGeral > 0 ? (totalRecebido / totalGeral * 100).toFixed(1) : 0;

  const filtrados = useMemo(() => clientesVisiveis.filter(c => {
    const t  = c.nome.toLowerCase().includes(filtro.toLowerCase()) || c.bairro.toLowerCase().includes(filtro.toLowerCase());
    const ci = filtroCidade === "Todas" || c.cidade === filtroCidade;
    const v  = filtroVendedor === "Todos" || c.vendedor === filtroVendedor;
    return t && ci && v;
  }), [clientesVisiveis, filtro, filtroCidade, filtroVendedor]);

  // ── Safe area bottom para iPhones com notch ──
  const safeBottom = "env(safe-area-inset-bottom, 0px)";
  const navH       = isMobile ? 60 : 0;

  if (carregando)
    return <div style={{ background:"#0D1B2A", minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", color:"#F0C040", fontSize:18, fontWeight:700, fontFamily:"'Segoe UI',sans-serif" }}>⏳ Carregando...</div>;

  if (!usuario)
    return <Login vendedores={vendedores} senhaGestor={senhaGestor} onLogin={setUsuario} isMobile={isMobile}
      onCadastrarVendedor={(nome, senha) => {
        setVendedores(prev => {
          const novos = [...prev, { nome, senha }];
          salvarFirebase(clientes, novos, senhaGestor);
          return novos;
        });
      }}
    />;

  if (view === "cadastro")
    return <CadastroCliente onVoltar={() => setView("lista")} onSalvar={adicionarCliente} isMobile={isMobile} vendedores={vendedores} onAdicionarVendedor={adicionarVendedor} />;

  if (view === "recibo" && reciboData)
    return <Recibo data={reciboData} onVoltar={() => setView("cliente")} isMobile={isMobile} />;
  if (view === "cliente" && clienteSel)
    return <ClienteDetalhe cliente={clienteSel} onVoltar={() => { setView("lista"); setSelectedId(null); }} isMobile={isMobile} navH={navH} perfil={usuario.perfil}
      onMarcarParcela={(acordoId, parcelaIdx) => {
        atualizarClientes(prev => prev.map(c => {
          if (c.id !== selectedId) return c;
          const novosAcordos = (c.acordos||[]).map(a => {
            if (a.id !== acordoId) return a;
            const novasParcelas = a.parcelas.map((p, i) => i === parcelaIdx ? { ...p, paga:true } : p);
            return { ...a, parcelas:novasParcelas };
          });
          return { ...c, acordos:novosAcordos };
        }));
      }}
      onDeletar={() => {
        atualizarClientes(prev => prev.filter(c => c.id !== selectedId));
        setSelectedId(null);
        setView("lista");
      }}
      onSalvarAcordo={(acordo, reciboAcordo) => {
        atualizarClientes(prev => prev.map(c => {
          if (c.id !== selectedId) return c;
          return { ...c, acordos:[...(c.acordos||[]), acordo] };
        }));
        setReciboData({ ...reciboAcordo, cliente:clienteSel, saldoAntes:clienteSel.saldo, saldoDepois:clienteSel.saldo });
        setView("recibo");
      }}
      onSalvarPagamento={(rec, abat) => {
        const saldoAntes = clienteSel.saldo;
        const novoSaldo = Math.max(0, saldoAntes - abat);
        atualizarClientes(prev => prev.map(c => {
          if (c.id !== selectedId) return c;
          return { ...c, saldo:novoSaldo, pagamentos:[...c.pagamentos, rec] };
        }));
        setReciboData({ ...rec, cliente:clienteSel, saldoAntes, saldoDepois:novoSaldo });
        setView("recibo");
      }}
      onMarcarEntrada={(acordoId) => {
        const acordo = clienteSel.acordos?.find(a => a.id === acordoId);
        if (!acordo || acordo.entradaPaga) return;
        const saldoAntes = clienteSel.saldo;
        const novoSaldo = Math.max(0, saldoAntes - acordo.entrada);
        const rec = { id:Date.now(), data:hoje(), valor:acordo.entrada, desconto:0, abatimento:acordo.entrada, obs:`Entrada do acordo de ${acordo.data}` };
        atualizarClientes(prev => prev.map(c => {
          if (c.id !== selectedId) return c;
          const novosAcordos = (c.acordos||[]).map(a => a.id === acordoId ? { ...a, entradaPaga:true } : a);
          return { ...c, saldo:novoSaldo, pagamentos:[...c.pagamentos, rec], acordos:novosAcordos };
        }));
        setReciboData({ ...rec, cliente:clienteSel, saldoAntes, saldoDepois:novoSaldo });
        setView("recibo");
      }}
      onMarcarParcela={(acordoId, parcelaIdx) => {
        const acordo = clienteSel.acordos?.find(a => a.id === acordoId);
        if (!acordo) return;
        const parcela = acordo.parcelas[parcelaIdx];
        if (!parcela || parcela.paga) return;
        const saldoAntes = clienteSel.saldo;
        const novoSaldo = Math.max(0, saldoAntes - parcela.valor);
        const rec = { id:Date.now(), data:hoje(), valor:parcela.valor, desconto:0, abatimento:parcela.valor, obs:`Parcela ${parcela.numero}x do acordo de ${acordo.data}` };
        atualizarClientes(prev => prev.map(c => {
          if (c.id !== selectedId) return c;
          const novosAcordos = (c.acordos||[]).map(a => {
            if (a.id !== acordoId) return a;
            const novasParcelas = a.parcelas.map((p, i) => i === parcelaIdx ? { ...p, paga:true } : p);
            return { ...a, parcelas:novasParcelas };
          });
          return { ...c, saldo:novoSaldo, pagamentos:[...c.pagamentos, rec], acordos:novosAcordos };
        }));
        setReciboData({ ...rec, cliente:clienteSel, saldoAntes, saldoDepois:novoSaldo });
        setView("recibo");
      }}
      onSalvarOcorrencia={(oc, excluirId) => {
        if (excluirId) {
          atualizarClientes(prev => prev.map(c => c.id !== selectedId ? c : { ...c, ocorrencias:c.ocorrencias.filter(o => o.id !== excluirId) }));
        } else if (oc && oc.id) {
          atualizarClientes(prev => prev.map(c => c.id !== selectedId ? c : { ...c, ocorrencias:c.ocorrencias.map(o => o.id === oc.id ? oc : o) }));
        } else {
          atualizarClientes(prev => prev.map(c => c.id !== selectedId ? c : { ...c, ocorrencias:[oc, ...c.ocorrencias] }));
        }
      }}
    />;

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
          <span style={{ fontSize:12, color:C.textMed }}>👤 {usuario.nome} · {usuario.perfil === "gestor" ? "Gestor" : "Vendedor"}</span>
          {["dashboard","lista"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ background:view===v?C.gold:"transparent", color:view===v?"#000":C.gold, border:`1px solid ${C.gold}`, borderRadius:7, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer", minHeight:44 }}>
              {v === "dashboard" ? "📊 Resumo" : "📋 Clientes"}
            </button>
          ))}
          <button onClick={() => setUsuario(null)} style={{ background:"none", border:`1px solid ${C.border}`, color:C.textLow, borderRadius:7, padding:"8px 14px", fontSize:12, cursor:"pointer" }}>Sair</button>
        </div>
      ) : (
        <div style={{ background:C.header, borderBottom:`1px solid ${C.border}`, padding:`calc(env(safe-area-inset-top,0px) + 10px) 16px 10px`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <div>
            <div style={{ fontSize:9, color:C.gold, letterSpacing:2, textTransform:"uppercase", fontWeight:700 }}>Bio Ozônio</div>
            <div style={{ fontSize:15, fontWeight:800, color:C.textWhite }}>Sistema de Cobrança</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:11, color:C.gold }}>👤 {usuario.nome}</div>
            <button onClick={() => setUsuario(null)} style={{ background:"none", border:`1px solid ${C.border}`, color:C.textLow, borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>Sair</button>
          </div>
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
              { label:"Contatados",         value:`${contatados}/${clientesVisiveis.length}`,   cor:C.blue,  icon:"📞" },
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
              {[...clientesVisiveis].sort((a, b) => b.saldo - a.saldo).slice(0, isMobile?5:6).map((c, i) => (
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
                Ver todos os {clientesVisiveis.length} clientes →
              </button>
            </div>

            <div style={{ background:C.card, borderRadius:10, padding:isMobile?"14px 14px":"20px", border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
              <div style={{ fontWeight:800, color:C.textWhite, marginBottom:12, fontSize:13, paddingBottom:8, borderBottom:`1px solid ${C.border}` }}>
                📋 <span style={{ color:C.blue }}>Últimas Ocorrências</span>
              </div>
              {clientesVisiveis.filter(c => c.ocorrencias.length > 0).sort((a, b) => b.ocorrencias[0].id - a.ocorrencias[0].id).slice(0, 5).map(c => (
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
              {clientesVisiveis.filter(c => c.ocorrencias.length > 0).length === 0 &&
                <div style={{ color:C.textLow, fontSize:13, textAlign:"center", padding:20 }}>Nenhuma ocorrência ainda.</div>}
            </div>
          </div>
        </>}

        {/* LISTA */}
        {view === "lista" && <>
          <div style={{ display:"flex", gap:10, marginBottom:10, flexWrap:"wrap" }}>
            <input value={filtro} onChange={e => setFiltro(e.target.value)}
              placeholder="🔍  Buscar nome ou bairro..."
              style={{ flex:1, minWidth:160, ...iSt, marginBottom:0 }} />
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <select value={filtroCidade} onChange={e => setFiltroCidade(e.target.value)} style={{ ...iSt, flex:1, marginBottom:0 }}>
              {cidades.map(c => <option key={c}>{c}</option>)}
            </select>
            {usuario.perfil === "gestor" && <select value={filtroVendedor} onChange={e => setFiltroVendedor(e.target.value)} style={{ ...iSt, flex:1, marginBottom:0 }}>
              <option value="Todos">👤 Todos</option>
              {vendedores.map(v => <option key={v.nome} value={v.nome}>{v.nome}</option>)}
            </select>}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ background:C.blueBg, border:`1px solid ${C.blue}44`, borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:700, color:C.blue }}>
              {filtrados.length} clientes · {fmt(filtrados.reduce((s, c) => s + c.saldo, 0))}
            </div>
            <button onClick={() => setView("cadastro")} style={{ background:C.gold, color:"#000", border:"none", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:800, cursor:"pointer" }}>➕ Novo Cliente</button>
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
                    {c.vendedor && <div style={{ fontSize:10, color:C.gold, marginTop:1 }}>👤 {c.vendedor}</div>}
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
function ClienteDetalhe({ cliente, onVoltar, isMobile, navH, onSalvarPagamento, onSalvarAcordo, onSalvarOcorrencia, onDeletar, perfil, onMarcarParcela, onMarcarEntrada }) {
  const st = statusInfo(cliente);
  const safeBottom = "env(safe-area-inset-bottom, 0px)";
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("pagamento");
  const [form, setForm] = useState({});
  const [editOcId, setEditOcId] = useState(null);
  const [editOcTexto, setEditOcTexto] = useState("");

  function abrirModal(tab) {
    setModalTab(tab);
    setForm({ data:hoje(), valorRecebido:"", desconto:"", parcelas:2, datasParcelas:{}, obs:"", ocorrencia:"", tipoOcorrencia:TIPOS_OC[0] });
    setModalOpen(true);
  }
  const fp = s => parseFloat((s||"").replace(",",".")) || 0;
  function parcEstimada() {
    return Math.max(0, cliente.saldo - fp(form.valorRecebido)) / (form.parcelas||1);
  }
  function salvarPagamento() {
    const val = fp(form.valorRecebido), desc = fp(form.desconto);
    if (val <= 0 && desc <= 0) { alert("Informe valor recebido ou desconto."); return; }
    const abat = val + desc;
    const rec = { id:Date.now(), data:form.data, valor:val, desconto:desc, abatimento:abat, obs:form.obs };
    onSalvarPagamento(rec, abat);
    setModalOpen(false);
  }

  function salvarNegociacao() {
    const entrada = fp(form.valorRecebido);
    const nParcelas = form.parcelas || 2;
    const saldoRestante = Math.max(0, cliente.saldo - entrada);
    const valorParcela = nParcelas > 0 ? saldoRestante / nParcelas : 0;
    const parcelasArr = Array.from({ length: nParcelas }, (_, i) => ({
      numero: i + 1,
      valor: valorParcela,
      data: form.datasParcelas?.[i] || "",
      paga: false
    }));
    const acordo = {
      id: Date.now(),
      data: form.data,
      entrada,
      entradaPaga: false,
      parcelas: parcelasArr,
      obs: form.obs,
      saldoOriginal: cliente.saldo
    };
    // Acordo NÃO abate nada — só registra o plano
    // Mostra recibo do acordo como documento do plano
    const reciboAcordo = {
      id: Date.now(),
      data: form.data,
      valor: 0,
      desconto: 0,
      abatimento: 0,
      tipoRecibo: "acordo",
      acordo,
      obs: `Acordo: ${entrada > 0 ? `Entrada ${fmt(entrada)} + ` : ""}${nParcelas}x de ${fmt(valorParcela)}${form.obs ? " — " + form.obs : ""}`
    };
    onSalvarAcordo(acordo, reciboAcordo);
    setModalOpen(false);
  }
  function salvarOcorrencia() {
    if (!form.ocorrencia?.trim()) { alert("Descreva a ocorrência."); return; }
    const oc = { id:Date.now(), data:form.data, tipo:form.tipoOcorrencia, texto:form.ocorrencia };
    onSalvarOcorrencia(oc, null);
    setModalOpen(false);
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100dvh", color:C.textHigh, paddingBottom:`calc(${navH}px + ${safeBottom})` }}>
      <div style={{ background:C.header, borderBottom:`1px solid ${C.border}`, padding:isMobile?`calc(env(safe-area-inset-top,0px) + 10px) 14px 10px`:"0 22px", height:isMobile?"auto":56, display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100 }}>
        <button onClick={onVoltar} style={{ ...bOutline, padding:"8px 14px", minHeight:40, flexShrink:0 }}>← Voltar</button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:isMobile?13:15, color:C.textWhite, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cliente.nome}</div>
          <div style={{ fontSize:11, color:C.textLow }}>{cliente.bairro} · {cliente.cidade}</div>
        </div>
        <Badge label={st.label} cor={st.cor} bg={st.bg} />
        {perfil === "gestor" && <button onClick={() => { if(window.confirm(`Deletar "${cliente.nome}" e todos os seus dados?\n\nEsta ação não pode ser desfeita!`)) { onDeletar(); } }} style={{ background:"none", border:`1px solid ${C.red}`, color:C.red, borderRadius:8, padding:"6px 10px", fontSize:13, cursor:"pointer", flexShrink:0 }}>🗑️</button>}
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
            <button onClick={() => abrirModal("pagamento")} style={{ ...bPrimary, minHeight:48, marginBottom:0 }}>💰 Registrar Pagamento</button>
            <button onClick={() => abrirModal("negociacao")} style={{ ...bPrimary, background:C.goldDark, minHeight:48, marginBottom:0 }}>🤝 Negociar Parcelamento</button>
            <button onClick={() => abrirModal("ocorrencia")} style={{ ...bOutline, minHeight:48, display:"block", width:"100%", textAlign:"center" }}>📝 Registrar Ocorrência</button>
          </div>
        </div>

        {/* Pagamentos */}
        {/* Alerta de parcelas vencidas */}
        {(cliente.acordos||[]).length > 0 && (() => {
          const hoje2 = new Date().toISOString().split("T")[0];
          const vencidas = (cliente.acordos||[]).flatMap(a => a.parcelas.filter(p => !p.paga && p.data && p.data < hoje2));
          if (vencidas.length === 0) return null;
          return (
            <div style={{ background:C.redBg, border:`2px solid ${C.red}`, borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
              <div style={{ fontWeight:800, color:C.red, fontSize:13, marginBottom:8 }}>🚨 {vencidas.length} Parcela{vencidas.length>1?"s":""} Vencida{vencidas.length>1?"s":""}!</div>
              {vencidas.map((p, i) => (
                <div key={i} style={{ fontSize:12, color:C.textHigh, marginBottom:4 }}>• Parcela {p.numero}x — {fmt(p.valor)} — venceu em {p.data}</div>
              ))}
            </div>
          );
        })()}

        {/* Acordos */}
        {(cliente.acordos||[]).length > 0 && (
          <div style={{ background:C.card, borderRadius:12, padding:isMobile?"14px":"20px", marginBottom:14, border:`1px solid ${C.gold}44`, boxShadow:C.shadow }}>
            <div style={{ fontWeight:800, color:C.gold, marginBottom:12, fontSize:13 }}>🤝 Acordos de Parcelamento</div>
            {(cliente.acordos||[]).map((a, ai) => {
              const hoje2 = new Date().toISOString().split("T")[0];
              return (
                <div key={a.id} style={{ background:C.cardAlt, borderRadius:8, padding:"12px 14px", marginBottom:10, border:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, flexWrap:"wrap", gap:8 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:C.gold }}>Acordo {ai+1} — {a.data}</span>
                    {a.entrada > 0 && (
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:12, color:a.entradaPaga?C.green:C.red }}>Entrada: {fmt(a.entrada)}</span>
                        {!a.entradaPaga && perfil === "gestor" && (
                          <button onClick={() => onMarcarEntrada(a.id)} style={{ background:C.green, border:"none", color:"#000", borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:700, cursor:"pointer" }}>✓ Receber</button>
                        )}
                        {a.entradaPaga && <span style={{ fontSize:10, color:C.green, fontWeight:700 }}>✓ Recebida</span>}
                      </div>
                    )}
                  {a.obs && <div style={{ fontSize:12, color:C.textMed, marginBottom:8 }}>{a.obs}</div>}
                  <div style={{ display:"grid", gap:6 }}>
                    {a.parcelas.map((p, pi) => {
                      const vencida = p.data && p.data < hoje2 && !p.paga;
                      const cor = p.paga ? C.green : vencida ? C.red : C.textHigh;
                      return (
                        <div key={pi} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", background:vencida?C.redBg:p.paga?C.greenBg:C.card, borderRadius:6, border:`1px solid ${vencida?C.red:p.paga?C.green:C.border}` }}>
                          <span style={{ fontSize:11, fontWeight:800, color:cor, minWidth:24 }}>{p.numero}x</span>
                          <span style={{ fontSize:12, fontWeight:700, color:cor, flex:1 }}>{fmt(p.valor)}</span>
                          <span style={{ fontSize:11, color:C.textLow }}>{p.data||"sem data"}</span>
                          {!p.paga && perfil === "gestor" && <button onClick={() => onMarcarParcela(a.id, pi)} style={{ background:C.green, border:"none", color:"#000", borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:700, cursor:"pointer" }}>✓ Paga</button>}
                          {p.paga && <span style={{ fontSize:10, color:C.green, fontWeight:700 }}>✓ Paga</span>}
                          {vencida && <span style={{ fontSize:10, color:C.red, fontWeight:700 }}>VENCIDA</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:11, color:C.textLow, fontWeight:600 }}>{o.data}</span>
                  <button onClick={() => { setEditOcId(o.id); setEditOcTexto(o.texto); }} style={{ background:"none", border:`1px solid ${C.gold}`, color:C.gold, borderRadius:6, padding:"2px 8px", fontSize:11, cursor:"pointer", fontWeight:700 }}>✏️</button>
                  {perfil === "gestor" && <button onClick={() => { if(window.confirm("Excluir esta ocorrência?")) { onSalvarOcorrencia(null, o.id); } }} style={{ background:"none", border:`1px solid ${C.red}`, color:C.red, borderRadius:6, padding:"2px 8px", fontSize:11, cursor:"pointer", fontWeight:700 }}>🗑️</button>}
                </div>
              </div>
              {editOcId === o.id ? (
                <div>
                  <textarea value={editOcTexto} onChange={e => setEditOcTexto(e.target.value)} style={{ ...iSt, height:80, resize:"vertical", marginBottom:8 }} />
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => { onSalvarOcorrencia({ ...o, texto:editOcTexto }, null); setEditOcId(null); }} style={{ ...bPrimary, flex:1, marginBottom:0, minHeight:38, fontSize:13 }}>💾 Salvar</button>
                    <button onClick={() => setEditOcId(null)} style={{ ...bPrimary, flex:1, marginBottom:0, minHeight:38, fontSize:13, background:C.card, color:C.textMed }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize:13, color:C.textHigh, lineHeight:1.5 }}>{o.texto}</div>
              )}
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
                <select value={form.parcelas||2} onChange={e => setForm(p => ({ ...p, parcelas:parseInt(e.target.value), datasParcelas:{} }))} style={iSt}>
                  {[1,2,3,4,5,6,8,10,12].map(n => <option key={n} value={n}>{n}x</option>)}
                </select>
                <div style={{ background:C.goldBg, border:`1px solid ${C.gold}44`, borderRadius:8, padding:14, marginBottom:14 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <div><div style={{ fontSize:10, color:C.textLow, fontWeight:600, marginBottom:3 }}>SALDO ATUAL</div><div style={{ fontSize:16, fontWeight:900, color:C.red }}>{fmt(cliente.saldo)}</div></div>
                    <div><div style={{ fontSize:10, color:C.textLow, fontWeight:600, marginBottom:3 }}>PARCELA ESTIMADA</div><div style={{ fontSize:16, fontWeight:900, color:C.gold }}>{fmt(parcEstimada())}</div></div>
                  </div>
                </div>
                <label style={lbl}>📅 Datas das Parcelas</label>
                {Array.from({ length: form.parcelas||2 }, (_, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:12, color:C.gold, fontWeight:700, minWidth:24 }}>{i+1}x</span>
                    <span style={{ fontSize:12, color:C.textMed, minWidth:60 }}>{fmt(Math.max(0, cliente.saldo - fp(form.valorRecebido)) / (form.parcelas||1))}</span>
                    <input type="text" inputMode="numeric" placeholder="DD/MM/AAAA" value={form.datasParcelas?.[i]||""} onChange={e => {
                      let v = e.target.value.replace(/\D/g,"");
                      if (v.length > 2) v = v.slice(0,2) + "/" + v.slice(2);
                      if (v.length > 5) v = v.slice(0,5) + "/" + v.slice(5);
                      if (v.length > 10) v = v.slice(0,10);
                      setForm(p => ({ ...p, datasParcelas:{ ...p.datasParcelas, [i]:v } }));
                    }} style={{ ...iSt, flex:1, marginBottom:0, fontSize:14, padding:"8px 10px" }} />
                  </div>
                ))}
                <label style={lbl}>Observações</label>
                <textarea value={form.obs||""} onChange={e => setForm(p => ({ ...p, obs:e.target.value }))} placeholder="Ex: cliente ligará para confirmar…" style={{ ...iSt, height:60, resize:"none" }} />
                <button onClick={salvarNegociacao} style={{ ...bPrimary, minHeight:50 }}>✅ Confirmar Negociação</button>
              </>}
              {modalTab === "ocorrencia" && <>
                <label style={lbl}>Tipo de Ocorrência</label>
                <select value={form.tipoOcorrencia||TIPOS_OC[0]} onChange={e => setForm(p => ({ ...p, tipoOcorrencia:e.target.value }))} style={iSt}>
                  {TIPOS_OC.map(t => <option key={t}>{t}</option>)}
                </select>
                <label style={lbl}>Descrição</label>
                <textarea value={form.ocorrencia||""} onChange={e => setForm(p => ({ ...p, ocorrencia:e.target.value }))} placeholder="Descreva o que aconteceu…" style={{ ...iSt, height:100, resize:"vertical" }} />
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
  const isAcordo = data.tipoRecibo === "acordo";

  function mensagemWhatsApp() {
    let txt;
    if (isAcordo) {
      const a = data.acordo;
      txt = `*Bio Ozônio — Acordo de Parcelamento*\n\n` +
        `Cliente: *${data.cliente.nome}*\n` +
        `Data: ${data.data}\n` +
        `Saldo devedor: *${fmt(data.saldoAntes)}*\n` +
        (a.entrada > 0 ? `Entrada: *${fmt(a.entrada)}*\n` : "") +
        `Parcelas:\n` +
        a.parcelas.map(p => `  ${p.numero}x ${fmt(p.valor)} — venc. ${p.data||"a definir"}`).join("\n") +
        (a.obs ? `\nObs: ${a.obs}` : "") +
        `\n\n_Emitido em ${new Date().toLocaleDateString("pt-BR")} — Bio Ozônio_`;
    } else {
      txt = `*Bio Ozônio — Recibo de Pagamento*\n\n` +
        `Cliente: *${data.cliente.nome}*\n` +
        `Data: ${data.data}\n` +
        `Valor recebido: *${fmt(data.valor)}*\n` +
        (data.desconto > 0 ? `Desconto: ${fmt(data.desconto)}\n` : "") +
        `Total abatido: *${fmt(data.abatimento)}*\n` +
        `Saldo anterior: ${fmt(data.saldoAntes)}\n` +
        `*Novo saldo devedor: ${fmt(data.saldoDepois)}*\n` +
        (data.obs ? `\nObs: ${data.obs}\n` : "") +
        `\n_Emitido em ${new Date().toLocaleDateString("pt-BR")} — Bio Ozônio_`;
    }
    const fone = data.cliente.fone?.replace(/\D/g, "");
    const url = fone ? `https://wa.me/55${fone}?text=${encodeURIComponent(txt)}` : `https://wa.me/?text=${encodeURIComponent(txt)}`;
    window.open(url, "_blank");
  }

  async function compartilhar() {
    const txt = isAcordo
      ? `Bio Ozônio — Acordo\nCliente: ${data.cliente.nome}\nSaldo: ${fmt(data.saldoAntes)}\nData: ${data.data}`
      : `Bio Ozônio — Recibo\nCliente: ${data.cliente.nome}\nValor: ${fmt(data.valor)}\nNovo saldo: ${fmt(data.saldoDepois)}\nData: ${data.data}`;
    if (navigator.share) {
      try { await navigator.share({ title:"Bio Ozônio", text:txt }); } catch(e) {}
    } else { window.print(); }
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100dvh", display:"flex", flexDirection:"column", alignItems:"center", padding:isMobile?"12px":"28px", paddingTop:isMobile?"calc(env(safe-area-inset-top,0px) + 12px)":"28px" }}>
      <div style={{ background:"#fff", borderRadius:14, width:"100%", maxWidth:500, overflow:"hidden", boxShadow:"0 12px 50px rgba(0,0,0,.4)" }}>
        <div style={{ background:C.header, padding:"20px 24px", textAlign:"center", borderBottom:`3px solid ${C.gold}` }}>
          <div style={{ fontSize:9, color:C.gold, letterSpacing:4, textTransform:"uppercase", fontWeight:700 }}>Bio Ozônio</div>
          <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginTop:4 }}>{isAcordo ? "ACORDO DE PARCELAMENTO" : "RECIBO DE PAGAMENTO"}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:3 }}>N° {String(data.id).slice(-6)} · {data.data}</div>
        </div>
        <div style={{ padding:"20px 22px", background:"#fff", color:"#1A1A2E" }}>
          <div style={{ background:"#F4F6FA", borderRadius:8, padding:12, marginBottom:16, border:"1px solid #DDE3EC" }}>
            <div style={{ fontSize:10, color:"#6B7280", textTransform:"uppercase", fontWeight:600 }}>{isAcordo ? "Acordo com" : "Recebemos de"}</div>
            <div style={{ fontSize:15, fontWeight:800, color:"#1A1A2E", marginTop:3 }}>{data.cliente.nome}</div>
            <div style={{ fontSize:12, color:"#4A5568" }}>{data.cliente.endereco} · {data.cliente.cidade}</div>
            <div style={{ fontSize:12, color:"#4A5568" }}>{data.cliente.fone}</div>
          </div>

          {isAcordo ? (
            <>
              <div style={{ background:"#FDECEA", border:"2px solid #FFAAAA", borderRadius:8, padding:14, marginBottom:14, textAlign:"center" }}>
                <div style={{ fontSize:10, color:"#C0392B", textTransform:"uppercase", fontWeight:700 }}>Saldo Total em Negociação</div>
                <div style={{ fontSize:26, fontWeight:900, color:"#C0392B", marginTop:3 }}>{fmt(data.saldoAntes)}</div>
              </div>
              {data.acordo.entrada > 0 && (
                <div style={{ background:"#F0FFF4", border:"1px solid #68D391", borderRadius:8, padding:12, marginBottom:14 }}>
                  <div style={{ fontSize:10, color:"#276749", textTransform:"uppercase", fontWeight:700 }}>Entrada Acordada</div>
                  <div style={{ fontSize:20, fontWeight:900, color:"#276749" }}>{fmt(data.acordo.entrada)}</div>
                </div>
              )}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:10, color:"#6B7280", textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Parcelas</div>
                {data.acordo.parcelas.map(p => (
                  <div key={p.numero} style={{ display:"flex", justifyContent:"space-between", padding:"8px 10px", background:"#F4F6FA", borderRadius:6, marginBottom:6, border:"1px solid #DDE3EC" }}>
                    <span style={{ fontWeight:700, color:"#1A1A2E" }}>{p.numero}ª parcela</span>
                    <span style={{ fontWeight:800, color:"#1A7A4A" }}>{fmt(p.valor)}</span>
                    <span style={{ color:"#6B7280", fontSize:12 }}>Venc: {p.data||"a definir"}</span>
                  </div>
                ))}
              </div>
              {data.acordo.obs && <div style={{ background:"#FFFDE7", border:"1px solid #F9C930", borderRadius:6, padding:11, fontSize:12, color:"#7A5000", marginBottom:14 }}><strong>Obs:</strong> {data.acordo.obs}</div>}
            </>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {[
                  { l:"Saldo Anterior", v:fmt(data.saldoAntes), c:"#1A1A2E" },
                  { l:"Valor Recebido", v:fmt(data.valor), c:"#1A7A4A" },
                  { l:"Desconto Concedido", v:fmt(data.desconto), c:"#B8860B" },
                  { l:"Total Abatido", v:fmt(data.abatimento), c:"#1A7A4A" },
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
            </>
          )}

          <div style={{ textAlign:"center", paddingTop:14, borderTop:"1px dashed #DDE3EC" }}>
            <div style={{ width:180, borderTop:"1px solid #1A1A2E", margin:"16px auto 0", paddingTop:7, fontSize:11, color:"#6B7280" }}>{isAcordo ? "Assinatura do Cliente" : "Assinatura do Cliente"}</div>
            <div style={{ fontSize:10, color:"#9CA3AF", marginTop:8 }}>Emitido em {new Date().toLocaleDateString("pt-BR")} — Bio Ozônio</div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16, width:"100%", maxWidth:500 }}>
        <button onClick={onVoltar} style={{ ...bOutline, textAlign:"center", minHeight:48 }}>← Voltar</button>
        <button onClick={mensagemWhatsApp} style={{ background:"#25D366", color:"#fff", border:"none", borderRadius:8, padding:"12px 18px", fontSize:14, fontWeight:800, cursor:"pointer", textAlign:"center", minHeight:48 }}>💬 WhatsApp</button>
        <button onClick={compartilhar} style={{ ...bPrimary, marginBottom:0, minHeight:48, gridColumn:"1/-1" }}>📤 Compartilhar</button>
      </div>
    </div>
  );
}

// ─── ESTILOS BASE ────────────────────────────────────────────────────────────
const lbl     = { display:"block", fontSize:10, color:C.textLow, fontWeight:700, marginBottom:5, textTransform:"uppercase", letterSpacing:.6 };
const iSt     = { display:"block", width:"100%", boxSizing:"border-box", background:C.input, border:`1.5px solid ${C.borderMed}`, borderRadius:8, padding:"12px 13px", color:C.textWhite, fontSize:16, marginBottom:12, outline:"none", fontFamily:"inherit", WebkitUserSelect:"text", userSelect:"text", WebkitAppearance:"none" };
const bPrimary= { background:C.gold, color:"#000", border:"none", borderRadius:8, padding:"12px 18px", fontSize:14, fontWeight:800, cursor:"pointer", display:"block", width:"100%", textAlign:"center", marginBottom:8 };
const bOutline= { background:"transparent", color:C.gold, border:`1.5px solid ${C.gold}`, borderRadius:8, padding:"11px 16px", fontSize:13, fontWeight:700, cursor:"pointer", display:"inline-block" };

// ─── CADASTRO DE CLIENTE ─────────────────────────────────────────────────────
function CadastroCliente({ onVoltar, onSalvar, isMobile, vendedores, onAdicionarVendedor }) {
  const safeBottom = "env(safe-area-inset-bottom, 0px)";
  const [f, setF] = useState({ nome:"", cidade:"", bairro:"", endereco:"", cep:"", fone:"", saldo:"", vendedor:vendedores[0]?.nome||"" });
  const [novoVendedor, setNovoVendedor] = useState("");
  const [adicionandoVendedor, setAdicionandoVendedor] = useState(false);
  const upd = k => e => setF(p => ({ ...p, [k]:e.target.value }));

  function salvar() {
    if (!f.nome.trim()) { alert("Informe o nome do cliente."); return; }
    if (!f.saldo || parseFloat(f.saldo.replace(",",".")) <= 0) { alert("Informe o valor do débito."); return; }
    onSalvar(f);
  }

  function salvarNovoVendedor() {
    if (!novoVendedor.trim()) return;
    const senha = prompt("Defina uma senha para " + novoVendedor.trim() + ":") || "123456";
    onAdicionarVendedor(novoVendedor.trim(), senha);
    setF(p => ({ ...p, vendedor:novoVendedor.trim() }));
    setNovoVendedor("");
    setAdicionandoVendedor(false);
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100dvh", color:C.textHigh, paddingBottom:`calc(20px + ${safeBottom})` }}>
      <div style={{ background:C.header, borderBottom:`1px solid ${C.border}`, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100 }}>
        <button onClick={onVoltar} style={{ background:"none", border:`1px solid ${C.border}`, color:C.gold, borderRadius:8, padding:"6px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>← Voltar</button>
        <div style={{ fontWeight:800, fontSize:16, color:C.textWhite }}>➕ Novo Cliente</div>
      </div>
      <div style={{ padding:isMobile?"16px":"24px", maxWidth:500, margin:"0 auto" }}>
        <div style={{ background:C.card, borderRadius:12, padding:"20px", border:`1px solid ${C.border}`, marginBottom:16 }}>
          <div style={{ fontWeight:800, color:C.gold, marginBottom:16, fontSize:13 }}>👤 Vendedor Responsável</div>
          {adicionandoVendedor ? (
            <div style={{ marginBottom:12 }}>
              <input value={novoVendedor} onChange={e => setNovoVendedor(e.target.value)} placeholder="Nome do novo vendedor" style={{ ...iSt, marginBottom:8 }} />
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={salvarNovoVendedor} style={{ ...bPrimary, flex:1, marginBottom:0, minHeight:44 }}>✓ Confirmar</button>
                <button onClick={() => setAdicionandoVendedor(false)} style={{ background:C.card, border:`1px solid ${C.border}`, color:C.textMed, borderRadius:8, padding:"0 16px", cursor:"pointer", fontWeight:700 }}>✕ Cancelar</button>
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <select value={f.vendedor} onChange={upd("vendedor")} style={{ ...iSt, flex:1, marginBottom:0 }}>
                {vendedores.map(v => <option key={v.nome} value={v.nome}>{v.nome}</option>)}
              </select>
              <button onClick={() => setAdicionandoVendedor(true)} style={{ background:C.goldBg, border:`1px solid ${C.gold}`, color:C.gold, borderRadius:8, padding:"0 14px", cursor:"pointer", fontWeight:700, fontSize:13, whiteSpace:"nowrap" }}>+ Novo</button>
            </div>
          )}
        </div>
        <div style={{ background:C.card, borderRadius:12, padding:"20px", border:`1px solid ${C.border}`, marginBottom:16 }}>
          <div style={{ fontWeight:800, color:C.gold, marginBottom:16, fontSize:13 }}>📋 Dados do Cliente</div>
          <label style={lbl}>Nome completo *</label>
          <input value={f.nome} onChange={upd("nome")} placeholder="Nome do cliente ou estabelecimento" style={iSt} />
          <label style={lbl}>Telefone</label>
          <input value={f.fone} onChange={upd("fone")} placeholder="(27) 99999-9999" inputMode="tel" style={iSt} />
          <label style={lbl}>Endereço</label>
          <input value={f.endereco} onChange={upd("endereco")} placeholder="Rua, número" style={iSt} />
          <label style={lbl}>Bairro</label>
          <input value={f.bairro} onChange={upd("bairro")} placeholder="Bairro" style={iSt} />
          <label style={lbl}>Cidade</label>
          <input value={f.cidade} onChange={upd("cidade")} placeholder="Cidade" style={iSt} />
          <label style={lbl}>CEP</label>
          <input value={f.cep} onChange={upd("cep")} placeholder="00000-000" inputMode="numeric" style={iSt} />
        </div>
        <div style={{ background:C.card, borderRadius:12, padding:"20px", border:`1px solid ${C.border}`, marginBottom:16 }}>
          <div style={{ fontWeight:800, color:C.red, marginBottom:16, fontSize:13 }}>💰 Valor do Débito</div>
          <label style={lbl}>Saldo devedor (R$) *</label>
          <input value={f.saldo} onChange={upd("saldo")} placeholder="0,00" inputMode="decimal" style={{ ...iSt, fontSize:22, fontWeight:800, color:C.red }} />
        </div>
        <button onClick={salvar} style={{ ...bPrimary, minHeight:54, fontSize:16 }}>💾 Cadastrar Cliente</button>
        <button onClick={onVoltar} style={{ ...bOutline, width:"100%", textAlign:"center", display:"block", marginTop:8, minHeight:44 }}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function Login({ vendedores, senhaGestor, onLogin, isMobile, onCadastrarVendedor }) {
  const [tipo, setTipo]         = useState("vendedor");
  const [nome, setNome]         = useState("");
  const [senha, setSenha]       = useState("");
  const [erro, setErro]         = useState("");
  const [painelGestor, setPainelGestor] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [sucesso, setSucesso]   = useState("");

  function entrar() {
    setErro("");
    if (tipo === "gestor") {
      if (!senha) { setErro("Digite a senha."); return; }
      if (senha === senhaGestor) {
        onLogin({ nome:"Gestor", perfil:"gestor" });
      } else {
        setErro("Senha incorreta.");
      }
    } else {
      if (!nome) { setErro("Selecione seu nome."); return; }
      if (!senha) { setErro("Digite sua senha."); return; }
      const vendedor = vendedores.find(v => v.nome === nome);
      if (!vendedor) { setErro("Vendedor não encontrado."); return; }
      if (senha === vendedor.senha) {
        onLogin({ nome, perfil:"vendedor" });
      } else {
        setErro("Senha incorreta.");
      }
    }
  }

  function cadastrarVendedor() {
    if (!novoNome.trim()) { alert("Informe o nome."); return; }
    if (!novaSenha.trim() || novaSenha.length < 4) { alert("Senha deve ter ao menos 4 caracteres."); return; }
    if (vendedores.find(v => v.nome === novoNome.trim())) { alert("Vendedor já cadastrado."); return; }
    onCadastrarVendedor(novoNome.trim(), novaSenha.trim());
    setSucesso(`Vendedor "${novoNome.trim()}" cadastrado!`);
    setNovoNome("");
    setNovaSenha("");
    setTimeout(() => setSucesso(""), 3000);
  }

  if (painelGestor) return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:11, color:C.gold, letterSpacing:4, textTransform:"uppercase", fontWeight:700 }}>Bio Ozônio</div>
          <div style={{ fontSize:22, fontWeight:900, color:C.textWhite }}>👥 Gerenciar Vendedores</div>
        </div>
        <div style={{ background:C.card, borderRadius:16, padding:24, border:`1px solid ${C.border}`, marginBottom:16 }}>
          <div style={{ fontWeight:800, color:C.gold, marginBottom:16, fontSize:13 }}>➕ Cadastrar Novo Vendedor</div>
          <label style={lbl}>Nome</label>
          <input value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Nome do vendedor" style={iSt} />
          <label style={lbl}>Senha</label>
          <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Mínimo 4 caracteres" style={iSt} />
          {sucesso && <div style={{ color:C.green, fontSize:13, marginBottom:12, fontWeight:600 }}>✅ {sucesso}</div>}
          <button onClick={cadastrarVendedor} style={{ ...bPrimary, minHeight:48 }}>💾 Cadastrar</button>
        </div>
        <div style={{ background:C.card, borderRadius:16, padding:24, border:`1px solid ${C.border}`, marginBottom:16 }}>
          <div style={{ fontWeight:800, color:C.blue, marginBottom:12, fontSize:13 }}>📋 Vendedores Cadastrados</div>
          {vendedores.length === 0 && <div style={{ color:C.textLow, fontSize:13 }}>Nenhum vendedor cadastrado.</div>}
          {vendedores.map(v => (
            <div key={v.nome} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ color:C.textWhite, fontWeight:600 }}>👤 {v.nome}</div>
              <div style={{ color:C.textLow, fontSize:12 }}>Senha: {v.senha}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setPainelGestor(false)} style={{ ...bOutline, width:"100%", textAlign:"center", display:"block", minHeight:48 }}>← Voltar ao Login</button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:11, color:C.gold, letterSpacing:4, textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>Bio Ozônio</div>
          <div style={{ fontSize:26, fontWeight:900, color:C.textWhite }}>Sistema de Cobrança</div>
          <div style={{ fontSize:13, color:C.textLow, marginTop:4 }}>Acesse sua conta</div>
        </div>
        <div style={{ background:C.card, borderRadius:16, padding:28, border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", gap:8, marginBottom:22 }}>
            {[["vendedor","👤 Vendedor"],["gestor","🔐 Gestor"]].map(([t, l]) => (
              <button key={t} onClick={() => { setTipo(t); setErro(""); setSenha(""); setNome(""); }}
                style={{ flex:1, padding:"10px", borderRadius:8, border:`2px solid ${tipo===t?C.gold:C.border}`, background:tipo===t?C.goldBg:"transparent", color:tipo===t?C.gold:C.textLow, fontWeight:700, fontSize:13, cursor:"pointer" }}>{l}</button>
            ))}
          </div>

          {tipo === "vendedor" && <>
            <label style={lbl}>Seu nome</label>
            <select value={nome} onChange={e => { setNome(e.target.value); setSenha(""); setErro(""); }} style={{ ...iSt }}>
              <option value="">Selecione...</option>
              {vendedores.map(v => <option key={v.nome} value={v.nome}>{v.nome}</option>)}
            </select>
          </>}

          <label style={lbl}>{tipo === "gestor" ? "Senha do gestor" : "Sua senha"}</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === "Enter" && entrar()}
            placeholder="••••••••" style={iSt} />

          {erro && <div style={{ color:C.red, fontSize:13, marginBottom:12, textAlign:"center", fontWeight:600 }}>{erro}</div>}
          <button onClick={entrar} style={{ ...bPrimary, minHeight:52, fontSize:16, marginBottom:8 }}>Entrar →</button>
          {tipo === "gestor" && <button onClick={() => { if(senha === senhaGestor) { setPainelGestor(true); } else { setErro("Digite a senha correta para acessar."); } }} style={{ ...bOutline, width:"100%", textAlign:"center", display:"block", minHeight:44, fontSize:13 }}>👥 Gerenciar Vendedores</button>}
        </div>
        <div style={{ textAlign:"center", marginTop:16, fontSize:11, color:C.textMuted }}>
          Senha padrão do gestor: <strong style={{ color:C.gold }}>bio2024</strong>
        </div>
      </div>
    </div>
  );
}
