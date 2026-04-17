import { el, mountReveal } from "../ui.js";

export function TermsPage() {
  const wrap = el("div", {class: "container", style: "padding: 20px; padding-bottom: 80px; max-width: 800px; margin: 0 auto; line-height: 1.6;"});
  
  wrap.append(
    el("div", {style: "text-align: center; margin-bottom: 30px;"}, [
      el("h1", {class: "h1 reveal", style: "margin-bottom: 10px;"}, "Termos de Uso"),
      el("p", {class: "sub reveal"}, "Última atualização: " + new Date().toLocaleDateString())
    ]),
    
    el("p", {class: "reveal"}, "Bem-vindo à Bellator Barbearia. Ao utilizar nosso sistema, você concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso:"),
    
    el("h3", {class: "reveal", style: "margin-top: 30px; color: var(--primary);" }, "1. Uso do Sistema e Serviços"),
    el("p", {class: "reveal", style: "margin-top: 10px;"}, "Nosso sistema tem como objetivo permitir o agendamento de horários em nossas unidades. O uso da plataforma é de caráter pessoal, intransferível e para fins lícitos."),
    
    el("h3", {class: "reveal", style: "margin-top: 25px; color: var(--primary);"}, "2. Conta e Responsabilidades do Usuário"),
    el("p", {class: "reveal", style: "margin-top: 10px;"}, "Você é inteiramente responsável por manter a confidencialidade das credenciais de sua conta e por fornecer informações verdadeiras e atualizadas. Caso não possa comparecer a um agendamento, compromete-se a efetuar o cancelamento com a devida antecedência pelo próprio sistema ou entrando em contato."),
    
    el("h3", {class: "reveal", style: "margin-top: 25px; color: var(--primary);"}, "3. Disponibilidade do Sistema"),
    el("p", {class: "reveal", style: "margin-top: 10px;"}, "Embora nos esforcemos para manter o sistema online continuamente, não podemos garantir que ele estará livre de interrupções, falhas ou lentidão decorrentes de manutenções ou problemas técnicos fora de nosso controle."),
    
    el("h3", {class: "reveal", style: "margin-top: 25px; color: var(--primary);"}, "4. Alterações nos Termos"),
    el("p", {class: "reveal", style: "margin-top: 10px;"}, "Reservamo-nos o direito de modificar ou substituir estes termos a qualquer momento. Modificações significativas serão notificadas ou simplesmente entrarão em vigor assim que publicadas na plataforma."),

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
