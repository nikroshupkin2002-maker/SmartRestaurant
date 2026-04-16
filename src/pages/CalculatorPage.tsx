import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Info, Check, Calculator as CalcIcon, Plus, 
  Settings2, ArrowRight, ChevronLeft 
} from "lucide-react";

// Тот самый компонент карточки, который мы потеряли
const ProductCard = ({ active, set, label, priceDesc, children }: any) => (
  <div 
    className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer flex flex-col gap-4 ${
      active ? 'border-green-500 bg-green-50/50' : 'border-white bg-white hover:border-slate-100 shadow-sm'
    }`}
  >
    <div className="flex items-center justify-between gap-4" onClick={() => set(!active)}>
      <div>
        <span className={`font-black text-lg ${active ? 'text-green-900' : 'text-slate-800'}`}>{label}</span>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{priceDesc}</p>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
        active ? 'bg-green-500 border-green-500 text-white' : 'border-slate-100 bg-slate-50 text-slate-400'
      }`}>
        {active ? <Check size={20} strokeWidth={4} /> : <Plus size={20} />}
      </div>
    </div>
    
    <AnimatePresence>
      {active && children && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-green-200/50 pt-4"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export function CalculatorPage() {
  const navigate = useNavigate();

  // --- СОСТОЯНИЕ (STATE) ---
  const [loc, setLoc] = useState(1);
  const [chd, setChd] = useState(100);
  const [avg, setAvg] = useState(5000);
  const [margP, setMargP] = useState(70);
  const [aggrP, setAggrP] = useState(30);
  const [discP, setDiscP] = useState(0);

  const [p1, setP1] = useState(false);
  const [p2, setP2] = useState(false);
  const [p3, setP3] = useState(false);
  const [p4, setP4] = useState(false);
  const [appP, setAppP] = useState(420000);
  const [p5, setP5] = useState(false);
  const [p6, setP6] = useState(false);
  const [p7, setP7] = useState(false);
  const [p8, setP8] = useState(false);
  const [kCount, setKCount] = useState(1);

  // --- ЛОГИКА РАСЧЕТОВ ---
  const results = useMemo(() => {
    const marg = margP / 100;
    const aggr = aggrP / 100;
    const totalChecks = chd * 30 * loc;
    
    // 1. Текущая прибыль
    const nowProfit = (totalChecks * avg * marg) - (totalChecks * avg * 0.3 * aggr);

    // 2. Расчет затрат
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

    // 3. Эффект Smart Restaurant (на 40% клиентов)
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

  const formatM = (v: number) => v.toLocaleString('ru-RU').replace(',', ' ');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-green-200">F</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Freedom Bank</p>
              <p className="text-lg font-black leading-none">Smart Restaurant</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-green-600 transition-colors group">
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-wider">Меню</span>
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEFT: INPUTS */}
          <div className="flex-1 w-full space-y-12">
            <section>
              <h1 className="text-5xl font-black tracking-tighter mb-4">Smart Calc</h1>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100">
                <Info size={14} /> Расчет на 40% проникновения продуктов
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">
                <Settings2 size={16} /> 1. Основные параметры
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Локаций', val: loc, set: setLoc },
                  { label: 'Чеков/день', val: chd, set: setChd },
                  { label: 'Ср. чек', val: avg, set: setAvg },
                  { label: 'Маржа (%)', val: margP, set: setMargP },
                ].map((p, i) => (
                  <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{p.label}</label>
                    <input 
                      type="number" 
                      value={p.val} 
                      onChange={(e) => p.set(+e.target.value)} 
                      className="w-full text-2xl font-black outline-none bg-transparent"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">
                <Plus size={16} /> 2. Продукты
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProductCard active={p1} set={setP1} label="Без кассира" priceDesc="84 000 ₸ / лок" />
                <ProductCard active={p2} set={setP2} label="Без официанта" priceDesc="120 000 ₸ / лок" />
                <ProductCard active={p3} set={setP3} label="SR Delivery" priceDesc="60 000 ₸ / лок" />
                <ProductCard active={p4} set={setP4} label="Приложение" priceDesc="Своя цена">
                  <div className="bg-white p-4 rounded-2xl border border-green-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Стоимость (₸)</label>
                    <input type="number" value={appP} onChange={(e) => setAppP(+e.target.value)} className="w-full font-black text-green-700 outline-none" />
                  </div>
                </ProductCard>
                <ProductCard active={p8} set={setP8} label="Киоск" priceDesc="60 000 ₸ / ед">
                  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-green-100">
                    <button onClick={() => setKCount(Math.max(1, kCount - 1))} className="w-8 h-8 bg-green-100 rounded-lg text-green-600 font-black">-</button>
                    <span className="flex-1 text-center font-black">{kCount} шт</span>
                    <button onClick={() => setKCount(kCount + 1)} className="w-8 h-8 bg-green-100 rounded-lg text-green-600 font-black">+</button>
                  </div>
                </ProductCard>
                <ProductCard active={p5} set={setP5} label="Лояльность" priceDesc="60 000 ₸" />
              </div>
            </section>
          </div>

          {/* RIGHT: RESULTS SIDEBAR */}
          <div className="w-full lg:w-[400px] lg:sticky lg:top-12">
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col gap-8">
              <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Результат (30 дней)</p>
              
              <div className="space-y-4">
                <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Сейчас</p>
                  <p className="text-3xl font-black tracking-tighter">{formatM(results.now)} ₸</p>
                </div>

                <div className="flex justify-center py-2 text-slate-200">
                  <ArrowRight size={32} className="rotate-90 lg:rotate-0" />
                </div>

                <div className="p-8 rounded-[32px] bg-green-500 text-white text-center shadow-xl shadow-green-200">
                  <p className="text-[10px] font-black opacity-60 uppercase mb-1">Smart Restaurant</p>
                  <p className="text-4xl font-black tracking-tighter">{formatM(results.smart)} ₸</p>
                </div>

                <div className="p-6 rounded-[32px] bg-green-50 border-2 border-green-100 text-center">
                  <p className="text-[10px] font-black text-green-600 uppercase mb-1 text-xs">Выгода</p>
                  <p className="text-3xl font-black text-green-700 tracking-tighter">+{formatM(results.smart - results.now)} ₸</p>
                </div>
              </div>

              {results.cost > 0 && (
                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Затраты на внедрение</p>
                  <p className="font-black text-slate-600">-{formatM(results.cost)} ₸</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
