import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Check, Calculator as CalcIcon, Plus, Settings2, ArrowRight, ChevronLeft } from "lucide-react";

// Вспомогательный компонент для карточки продукта
const ProductCard = ({ active, set, label, desc, priceDesc, children }: any) => (
  <div className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${active ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
    <div className="flex items-center justify-between gap-4" onClick={() => set(!active)}>
      <div>
        <span className={`font-bold text-lg ${active ? 'text-green-800' : 'text-slate-800'}`}>{label}</span>
        {priceDesc && <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">{priceDesc}</p>}
        {desc && <p className="text-sm font-semibold text-slate-400 mt-1">{desc}</p>}
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${active ? 'bg-green-500 border-green-500 text-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
        {active ? <Check size={20} strokeWidth={4} /> : <Plus size={20} />}
      </div>
    </div>
    
    <AnimatePresence>
      {active && children && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-green-200/50 pt-4 mt-1"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export function CalculatorPage() {
  const navigate = useNavigate(); // Для кнопки Назад

  // --- ДАННЫЕ КАЛЬКУЛЯТОРА ---
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
  const [appL, setAppL] = useState(5);

  const [p5, setP5] = useState(false);
  const [p6, setP6] = useState(false);
  const [p7, setP7] = useState(false);
  
  const [p8, setP8] = useState(false);
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

  const formatM = (v: number) => v.toLocaleString('ru-RU').replace(',', ' ');

  const ParamCard = ({ label, val, set, unit }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-3">{label}</label>
      <div className="flex items-baseline gap-1">
        <input type="number" value={val} onChange={(e) => set(+e.target.value)} className="w-full text-2xl font-black text-slate-800 outline-none" />
        {unit && <span className="text-xl font-bold text-slate-400">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Хедер Freedom Bank */}
        <header className="flex items-center justify-between mb-8 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-black text-xl">F</div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">FREEDOM BANK</span>
                    <span className="font-extrabold text-slate-900">Smart Restaurant</span>
                </div>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">A</div>
        </header>

        {/* Кнопка "Назад" */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 transition-colors group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Назад в меню</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 w-full space-y-12">
            
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-3 flex items-center gap-3">
                <CalcIcon className="text-green-500" size={32} /> Smart Restaurant Calc
              </h1>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100 text-sm font-semibold">
                  <Info size={16} /> Расчет ведется на 40% проникновения продукта
              </div>
            </div>

            {/* БЛОК 1: ОСНОВНЫЕ ПАРАМЕТРЫ */}
            <section>
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <Settings2 size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">1. Основные параметры</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <ParamCard label="Локаций" val={loc} set={setLoc} unit="" />
                <ParamCard label="Чеков/день" val={chd} set={setChd} unit="" />
                <ParamCard label="Ср. чек (₸)" val={avg} set={setAvg} unit="₸" />
                <ParamCard label="Маржа (%)" val={margP} set={setMargP} unit="%" />
              </div>
            </section>

            {/* БЛОК 2: ДОПОЛНИТЕЛЬНО */}
            <section>
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <Plus size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">2. Дополнительные параметры</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Комиссия агр. (%)</label>
                  <input type="number" value={aggrP} onChange={(e) => setAggrP(+e.target.value)} className="w-24 text-2xl font-black text-slate-800 outline-none text-right" />
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Скидка на услуги (%)</label>
                  <input type="number" value={discP} onChange={(e) => setDiscP(+e.target.value)} className="w-24 text-2xl font-black text-slate-800 outline-none text-right" />
                </div>
              </div>
            </section>

            {/* БЛОК 3: ПРОДУКТЫ */}
            <section>
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <Check size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">3. Продукты</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ProductCard active={p1} set={setP1} label="Без кассира" priceDesc="84 000 ₸ / лок" />
                <ProductCard active={p2} set={setP2} label="Без официанта" priceDesc="120 000 ₸ / лок" />
                <ProductCard active={p3} set={setP3} label="SR Delivery" priceDesc="60 000 ₸ / лок" />
                
                <ProductCard active={p4} set={setP4} label="Приложение" desc="Настраиваемая цена">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-green-100 shadow-inner">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Цена приложения (₸)</label>
                      <input type="number" value={appP} onChange={(e) => setAppP(+e.target.value)} className="w-full text-lg font-bold text-green-900 outline-none" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-green-100 shadow-inner">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Локаций приложения</label>
                      <input type="number" value={appL} onChange={(e) => setAppL(+e.target.value)} className="w-full text-lg font-bold text-green-900 outline-none" />
                    </div>
                  </div>
                </ProductCard>

                <ProductCard active={p5} set={setP5} label="Лояльность" priceDesc="60 000 ₸" />
                <ProductCard active={p6} set={setP6} label="AppClip" priceDesc="35 000 ₸ / лок" />
                <ProductCard active={p7} set={setP7} label="Автоподтягивание счета" priceDesc="60 000 ₸ / лок" />
                
                <ProductCard active={p8} set={setP8} label="Киоск" priceDesc="60 000 ₸ / ед">
                  <div className="bg-white p-4 rounded-xl border border-green-100 shadow-inner">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Кол-во киосков</label>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setKCount(Math.max(1, kCount - 1))} className="w-10 h-10 rounded-lg bg-green-100 text-green-700 font-bold text-xl hover:bg-green-200 transition-colors">-</button>
                        <input type="number" value={kCount} onChange={(e) => setKCount(Math.max(1, +e.target.value))} className="w-full text-center text-lg font-black text-green-900 outline-none" />
                        <button onClick={() => setKCount(kCount + 1)} className="w-10 h-10 rounded-lg bg-green-100 text-green-700 font-bold text-xl hover:bg-green-200 transition-colors">+</button>
                    </div>
                  </div>
                </ProductCard>
              </div>
            </section>
          </div>

          {/* ИТОГОВАЯ ПАНЕЛЬ */}
          <div className="w-full lg:w-[420px] lg:sticky lg:top-12 mt-12 lg:mt-0">
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50">
              <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Итоговый расчет за 30 дней</h3>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[32px] text-center border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Прибыль сейчас</div>
                  <div className="text-3xl font-black text-slate-800 tracking-tight">{formatM(results.now)} <span className="text-2xl text-slate-500">₸</span></div>
                </div>

                <div className="relative pt-4 pb-4 flex justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-100"></div></div>
                  <div className="relative bg-white px-3 text-slate-200"><ArrowRight size={24} className="rotate-90" /></div>
                </div>

                <div className="bg-green-500 p-10 rounded-[32px] text-center text-white shadow-xl shadow-green-200">
                  <div className="text-[10px] font-bold opacity-80 uppercase mb-1.5 tracking-wider">С Smart Restaurant</div>
                  <div className="text-4xl font-black tracking-tight">{formatM(results.smart)} <span className="text-2xl opacity-80">₸</span></div>
                  {results.cost > 0 && (
                    <div className="mt-4 text-xs font-medium bg-white/15 px-3 py-1 rounded-full inline-block border border-white/20">Затраты на продукты: -{formatM(results.cost)} ₸</div>
                  )}
                </div>

                <div className="bg-green-50 p-6 rounded-[32px] text-center border-2 border-green-100">
                  <div className="text-[10px] font-bold text-green-600 uppercase mb-1.5 tracking-wider">Выгода внедрения</div>
                  <div className="text-3xl font-black text-green-600 tracking-tight">+{formatM(results.smart - results.now)} ₸</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
