import { el, mountReveal } from "../ui.js";

export function PrivacyPage() {
  const wrap = el("div", {class: "container", style: "padding: 20px; padding-bottom: 80px; max-width: 800px; margin: 0 auto; line-height: 1.6;"});
  
  wrap.append(
    el("div", {style: "text-align: center; margin-bottom: 30px;"}, [
      el("h1", {class: "h1 reveal", style: "margin-bottom: 10px;"}, "Política de Privacidade"),
      el("p", {class: "sub reveal"}, "Última atualização: " + new Date().toLocaleDateString())
    ]),
    
    el("p", {class: "reveal"}, "A sua privacidade é uma prioridade para nós. Esta política descreve como coletamos, usamos, protegemos e tratamos as suas informações pessoais ao utilizar os serviços da Bellator Barbearia."),
    
    el("h3", {class: "reveal", style: "margin-top: 30px; color: var(--primary);" }, "1. Informações Coletadas"),
    el("p", {class: "reveal", style: "margin-top: 10px;"}, "Durante a criação de sua conta e uso do sistema, nós coletamos informações básicas como o seu nome completo, endereço de e-mail e número de telefone. Também mantemos um histórico dos seus agendamentos e serviços realizados."),
    
    el("h3", {class: "reveal", style: "margin-top: 25px; color: var(--primary);"}, "2. Uso das Informações"),
    el("p", {class: "reveal", style: "margin-top: 10px;"}, "As informações coletadas são utilizadas exclusivamente para viabilizar e gerenciar os seus agendamentos, facilitar o contato em caso de imprevistos e melhorar a sua experiência em nossa barbearia."),
    
    el("h3", {class: "reveal", style: "margin-top: 25px; color: var(--primary);"}, "3. Compartilhamento de Dados"),
    el("p", {class: "reveal", style: "margin-top: 10px;"}, "Garantimos que não vendemos, alugamos ou compartilhamos as suas informações pessoais com terceiros para fins de marketing. O acesso aos dados é restrito à nossa equipe para a devida prestação do serviço."),
    
    el("h3", {class: "reveal", style: "margin-top: 25px; color: var(--primary);"}, "4. Segurança e Proteção"),
    el("p", {class: "reveal", style: "margin-top: 10px;"}, "Adotamos práticas adequadas de segurança da informação para proteger seus dados contra acessos não autorizados, alterações, divulgações ou destruições de suas informações pessoais e credenciais armazenadas."),

    el("div", {class: "hr reveal", style: "margin: 40px 0;"}),
    
    el("button", {
      class: "btn btn--primary reveal", 
      type: "button", 
      style: "width: 100%; max-width: 200px; margin: 0 auto; display: block;",
      onClick: () => { window.history.length > 2 ? history.back() : location.hash = '#/auth' }
    }, "Voltar")
  );

  mountReveal(wrap);
  return wrap;
}
