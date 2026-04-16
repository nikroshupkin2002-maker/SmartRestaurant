import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Info, Check, Calculator as CalcIcon, Plus, 
  Settings2, ArrowRight, ChevronLeft 
} from "lucide-react";

export function CalculatorPage() {
  const navigate = useNavigate();

  // --- ВСЕ ДАННЫЕ КАЛЬКУЛЯТОРА ---
  const [loc, setLoc] = useState(1);
  const [chd, setChd] = useState(100);
  const [avg, setAvg] = useState(5000);
  const [margP, setMargP] = useState(70);
  const [aggrP, setAggrP] = useState(30);
  const [discP, setDiscP] = useState(0);

  // Продукты
  const [p1, setP1] = useState(false); // Без кассира
  const [p2, setP2] = useState(false); // Без официанта
  const [p3, setP3] = useState(false); // SR Delivery
  const [p4, setP4] = useState(false); // Приложение
  const [appP, setAppP] = useState(420000);
  const [appL, setAppL] = useState(5);
  const [p5, setP5] = useState(false); // Лояльность
  const [p6, setP6] = useState(false); // AppClip
  const [p7, setP7] = useState(false); // Автосчет
  const [p8, setP8] = useState(false); // Киоск
  const [kCount, setKCount] = useState(1);

  // --- ЛОГИКА РАСЧЕТА ---
  const results = useMemo(() => {
    const marg = margP / 100;
    const aggr = aggrP / 100;
    const totalChecks = chd * 30 * loc;
    const nowProfit = (totalChecks * avg * marg) - (totalChecks * avg * 0.3 * aggr);

    let cost = 0;
    if (p1) cost += 84000 * loc;
    if (p2) cost += 120000 * loc;
    if (p3) cost += 60000 * loc;
    if (p4) cost += appP;
    if (p5) cost += 60000;
    if (p6) cost += 35000 * loc;
    if (p7) cost += 60000 * loc;
    if (p8) cost += 60000 * kCount;
    const finalCost = cost * (1 - discP / 100);

    const hasBoost = p1 || p2 || p3 || p4 || p8;
    const nAvg = hasBoost ? (avg * 0.6 + avg * 1.16 * 0.4) : avg;
    const nCh = p2 ? (totalChecks * 0.6 + totalChecks * 1.25 * 0.4) : totalChecks;
    const ret = (p1 || p2 || p3 || p4 || p5 || p7 || p8) ? (nCh * 0.2 * nAvg) : 0;
    const loy = p5 ? (nCh * 0.2 * nAvg * 0.3) : 0;

    let smartProfit = ((nCh * nAvg) + ret + loy) * marg - finalCost;
    if (!p3) smartProfit -= ((nCh * nAvg) * 0.3 * aggr);

    return {
      now: Math.round(nowProfit),
      smart: Math.round(smartProfit),
      cost: Math.round(finalCost)
    };
  }, [loc, chd, avg, margP, aggrP, discP, p1, p2, p3, p4, p5, p6, p7, p8, appP, kCount]);

  const formatM = (v: number) => v.toLocaleString('ru-RU');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 transition-colors group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Назад в меню</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full space-y-10">
            {/* БЛОК 1: ОСНОВНЫЕ ПАРАМЕТРЫ */}
            <section>
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <Settings2 size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">1. Основные параметры</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Локаций', val: loc, set: setLoc, unit: '' },
                  { label: 'Чеков/день', val: chd, set: setChd, unit: '' },
                  { label: 'Ср. чек (₸)', val: avg, set: setAvg, unit: '₸' },
                  { label: 'Маржа (%)', val: margP, set: setMargP, unit: '%' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">{item.label}</label>
                    <input type="number" value={item.val} onChange={(e) => item.set(+e.target.value)} className="w-full text-xl font-black text-slate-800 outline-none" />
                  </div>
                ))}
              </div>
            </section>

            {/* БЛОК 2: ДОПОЛНИТЕЛЬНО */}
            <section>
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <Plus size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">2. Дополнительные параметры</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Комиссия агр. (%)</label>
                  <input type="number" value={aggrP} onChange={(e) => setAggrP(+e.target.value)} className="w-full text-xl font-black text-slate-800 outline-none" />
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Скидка на услуги (%)</label>
                  <input type="number" value={discP} onChange={(e) => setDiscP(+e.target.value)} className="w-full text-xl font-black text-slate-800 outline-none" />
                </div>
              </div>
            </section>

            {/* БЛОК 3: ПРОДУКТЫ */}
            <section>
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <Check size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">3. Продукты</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'p1', label: 'Без кассира', active: p1, set: setP1 },
                  { id: 'p2', label: 'Без официанта', active: p2, set: setP2 },
                  { id: 'p3', label: 'SR Delivery', active: p3, set: setP3 },
                  { id: 'p5', label: 'Лояльность', active: p5, set: setP5 },
                  { id: 'p7', label: 'Автоподтягивание счета', active: p7, set: setP7 },
                  { id: 'p8', label: 'Киоск', active: p8, set: setP8 },
                ].map((p) => (
                  <div key={p.id} onClick={() => p.set(!p.active)} className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${p.active ? 'border-green-500 bg-green-50/50' : 'border-white bg-white hover:border-slate-100'}`}>
                    <span className={`font-bold ${p.active ? 'text-green-700' : 'text-slate-600'}`}>{p.label}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${p.active ? 'bg-green-500 border-green-500 text-white' : 'border-slate-100'}`}>
                      {p.active && <Check size={14} strokeWidth={4} />}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ИТОГОВАЯ ПАНЕЛЬ */}
          <div className="w-full lg:w-[380px] lg:sticky lg:top-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50">
              <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Итоговый расчет за 30 дней</h3>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-6 rounded-[32px] text-center border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Прибыль сейчас</div>
                  <div className="text-2xl font-black text-slate-800 tracking-tight">{formatM(results.now)} ₸</div>
                </div>

                <div className="relative pt-4 pb-4 flex justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative bg-white px-3 text-slate-300"><ArrowRight size={20} className="rotate-90" /></div>
                </div>

                <div className="bg-green-500 p-8 rounded-[32px] text-center text-white shadow-xl shadow-green-200">
                  <div className="text-[10px] font-bold opacity-80 uppercase mb-1 tracking-wider">С Smart Restaurant</div>
                  <div className="text-3xl font-black tracking-tight">{formatM(results.smart)} ₸</div>
                </div>

                <div className="bg-green-50 p-6 rounded-[32px] text-center border-2 border-green-100/50">
                  <div className="text-[10px] font-bold text-green-600 uppercase mb-1">Выгода от внедрения</div>
                  <div className="text-2xl font-black text-green-600 tracking-tight">+{formatM(results.smart - results.now)} ₸</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
