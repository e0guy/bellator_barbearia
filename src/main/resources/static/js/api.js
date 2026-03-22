const BASE_URL = "http://localhost:8080";

// ================= TOKEN =================
function getToken() {
  const t = localStorage.getItem("token");
  if (t == null || t === "") return null;
  const s = String(t).trim();
  if (s === "" || s === "undefined" || s === "null") return null;
  return s;
}

// ================= REQUEST =================
async function request(url, options = {}) {
  const token = getToken();
  const { headers: optHeaders, ...rest } = options;

  const res = await fetch(BASE_URL + url, {
    ...rest,
    headers: {
      ...(optHeaders && typeof optHeaders === "object" && !(optHeaders instanceof Headers)
        ? optHeaders
        : {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

// ================= AUTH =================
function normalizeRole(role) {
  if (role == null) return "cliente";
  return String(role).toLowerCase();
}

function persistUserFromAuth(data) {
  const raw = data.usuario ?? data.user;
  if (!raw) return;
  const user = { ...raw, role: normalizeRole(raw.role) };
  localStorage.setItem("user", JSON.stringify(user));
}

export async function login(email, senha) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha })
  });

  localStorage.setItem("token", data.token);
  persistUserFromAuth(data);
  return data;
}

export async function register(user) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(user)
  });
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  persistUserFromAuth(data);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function me() {
  const token = getToken();
  if (!token) return null;
  const raw = localStorage.getItem("user");
  let user = null;
  if (raw) {
    try {
      const u = JSON.parse(raw);
      user = { ...u, role: normalizeRole(u.role) };
    } catch {
      user = null;
    }
  }
  return { token, user };
}

// ================= SERVICES =================
export function listServices() {
  return request("/servicos");
}

// ================= BARBEIROS =================
export function listBarbers() {
  return request("/usuarios/barbeiros");
}

// ================= CATÁLOGO (serviços / barbeiros para o fluxo de agendamento) =================
let __catalog = null;

function normalizeCatalogService(s) {
  return {
    ...s,
    duracaoMin: s.duracaoMinutos ?? s.duracaoMin ?? 30
  };
}

function normalizeCatalogBarber(b) {
  return {
    ...b,
    horarios: b.horarios || { start: "09:00", end: "18:00", stepMin: 30 },
    especialidade: b.especialidade || ""
  };
}

export async function bootstrap() {
  const [services, barbers] = await Promise.all([
    listServices().catch(() => []),
    listBarbers().catch(() => [])
  ]);
  __catalog = {
    services: (Array.isArray(services) ? services : []).map(normalizeCatalogService),
    barbers: (Array.isArray(barbers) ? barbers : []).map(normalizeCatalogBarber)
  };
}

export function ensureDB() {
  if (!__catalog) return { services: [], barbers: [] };
  return __catalog;
}

// ================= AGENDA PÚBLICA (horários ocupados) =================
export async function getBusyTimes(barbeiroId, dataYYYYMMDD) {
  const qs = new URLSearchParams({
    barbeiroId: String(barbeiroId),
    data: dataYYYYMMDD
  });
  return request(`/agenda?${qs}`);
}

// ================= AGENDAMENTOS =================
let __appointmentsCache = [];

function statusLabel(s) {
  const x = String(s || "").toUpperCase();
  if (x === "AGENDADO") return "Agendado";
  if (x === "CANCELADO") return "Cancelado";
  if (x === "CONCLUIDO") return "Concluído";
  return String(s || "");
}

function toDataHoraISO(data, horario) {
  const d = data == null ? "" : String(data);
  let h = horario == null ? "00:00:00" : String(horario);
  if (h.length === 5) h = `${h}:00`;
  return `${d}T${h}`;
}

function normalizeAgendamentoResponse(r) {
  return {
    id: r.id,
    dataHora: toDataHoraISO(r.data, r.horario),
    status: statusLabel(r.status),
    servicoNome: r.servicoNome,
    barbeiroNome: r.barbeiroNome,
    clienteNome: r.clienteNome
  };
}

function normalizeAdminAgendamento(a) {
  return {
    id: a.id,
    dataHora: toDataHoraISO(a.data, a.horario),
    status: statusLabel(a.status),
    servicoNome: a.servicos?.nome,
    barbeiroNome: a.barbeiro?.nome,
    clienteNome: a.cliente?.nome
  };
}

function todayISO() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export async function refreshAppointmentsForUser(user) {
  __appointmentsCache = [];
  if (!user?.role) return;
  const role = user.role;
  try {
    if (role === "cliente") {
      const rows = await myAppointments();
      __appointmentsCache = (Array.isArray(rows) ? rows : []).map(normalizeAgendamentoResponse);
    } else if (role === "barbeiro") {
      const rows = await request(`/agendamentos/minha-agenda?data=${todayISO()}`);
      __appointmentsCache = (Array.isArray(rows) ? rows : []).map(normalizeAgendamentoResponse);
    } else if (role === "admin") {
      const rows = await request("/admin/agendamentos");
      __appointmentsCache = (Array.isArray(rows) ? rows : []).map(normalizeAdminAgendamento);
    }
  } catch (e) {
    console.error(e);
    __appointmentsCache = [];
  }
}

export function listAppointmentsForUser(user) {
  if (!user?.role) return [];
  return __appointmentsCache;
}

export function createAppointment(data) {
  return request("/agendamentos", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function myAppointments() {
  return request("/agendamentos/me");
}

export function completeAppointment(id) {
  return request(`/agendamentos/${id}/concluir`, {
    method: "PUT"
  });
}

export function cancelAppointment(id) {
  return request(`/agendamentos/${id}/cancelar`, {
    method: "PUT"
  });
}