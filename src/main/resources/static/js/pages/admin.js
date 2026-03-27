import { el, money, mountReveal } from "../ui.js";
import * as api from "../api.js";

export function AdminPage(ctx){
  const wrap = el("div", {});
  wrap.append(
    el("h1",{class:"h1 reveal"},"Painel do Administrador"),
    el("p",{class:"sub reveal"},"Relatórios e gestão (API).")
  );

  const doneEl = el("strong",{}, "0");
  const totalEl = el("strong",{}, money(0));

  const card = el("div",{class:"card reveal"});
  card.append(
    el("div",{class:"kv"}, [
      el("i",{"data-lucide":"calendar"}),
      el("div",{}, [el("small",{},"Atendimentos concluídos"), el("br"), doneEl]),
      el("div",{class:"right"},"")
    ]),
    el("div",{class:"hr"}),
    el("div",{class:"kv"}, [
      el("i",{"data-lucide":"star"}),
      el("div",{}, [el("small",{},"Faturamento (concluídos)"), el("br"), totalEl]),
      el("div",{class:"right"},"")
    ])
  );

  const barberSection = el("div", { class: "section reveal" }, [
    el("h2", { class: "h2", style: "margin-top:2rem;" }, "Gestão de Equipe"),
    el("p", { class: "sub", style: "margin-bottom:1rem;" }, "Cadastrar um novo barbeiro.")
  ]);

  const inpName = el("input", { type: "text", class: "input", placeholder: "Nome do Barbeiro" });
  const inpEmail = el("input", { type: "email", class: "input", placeholder: "E-mail de acesso" });
  const inpPhone = el("input", { type: "text", class: "input", placeholder: "WhastApp/Telefone" });
  const inpPass = el("input", { type: "password", class: "input", placeholder: "Senha provisória" });
  const btnCadastrar = el("button", { class: "btn" }, "Cadastrar Profissional");

  btnCadastrar.onclick = async () => {
    const nome = inpName.value.trim();
    const email = inpEmail.value.trim();
    const telefone = inpPhone.value.trim();
    const senha = inpPass.value.trim();
    if (!nome || !email || !senha) {
      alert("Preencha os campos obrigatórios.");
      return;
    }
    btnCadastrar.disabled = true;
    btnCadastrar.textContent = "Aguarde...";
    try {
      await api.registerBarber({ nome, email, telefone, senha });
      alert("Barbeiro cadastrado com sucesso no sistema!");
      inpName.value = "";
      inpEmail.value = "";
      inpPhone.value = "";
      inpPass.value = "";
    } catch (e) {
      alert("Erro ao cadastrar: " + e.message);
    } finally {
      btnCadastrar.disabled = false;
      btnCadastrar.textContent = "Cadastrar Profissional";
    }
  };

  const formCard = el("div", { class: "card", style: "display:flex; flex-direction:column; gap:16px;" }, [
    inpName, inpEmail, inpPhone, inpPass, btnCadastrar
  ]);
  barberSection.append(formCard);

  wrap.append(
    el("div",{class:"section"}, [card]),
    barberSection
  );

  // Atualiza via API
  (async ()=>{
    try{
      await api.refreshAdminReport();
      const report = api.adminReport();
      doneEl.textContent = String(report.doneCount || 0);
      totalEl.textContent = money(report.total || 0);
      try{ window.lucide?.createIcons?.(); }catch(e){}
    }catch(e){}
  })();

  mountReveal(wrap);
  return wrap;
}
