import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Для работы кнопки назад
import { motion } from "framer-motion";
import { 
  Info, 
  Check, 
  Calculator as CalcIcon, 
  Plus, 
  Settings2, 
  ArrowRight, 
  ChevronLeft 
} from "lucide-react";

export function CalculatorPage() {
  const navigate = useNavigate(); // Инициализируем переход по страницам

  // --- ТВОЯ ЛОГИКА (STATE) ---
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

  // --- ТВОИ РАСЧЕТЫ ---
  const results = useMemo(() => {
    const marg = margP / 100;
    const aggr = aggrP / 100;
    const totalChecks = chd * 30 * loc;
    
    // Прибыль сейчас
    const nowProfit = (totalChecks * avg * marg) - (totalChecks * avg * 0.3 * aggr);

    // Затраты
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

    // Прибыль Smart
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
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Кнопка НАЗАД */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-500 hover:text-green-600 transition-colors mb-8 group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Назад в меню</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Левая часть: Параметры */}
          <div className="flex-1 space-y-8">
            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings2 size={16} /> 1. Основные параметры
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Локаций</label>
                  <input type="number" value={loc} onChange={(e) => setLoc(+e.target.value)} className="w-full text-xl font-bold outline-none" />
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Чеков в день</label>
                  <input type="number" value={chd} onChange={(e) => setChd(+e.target.value)} className="w-full text-xl font-bold outline-none" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Plus size={16} /> 3. Продукты
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'p1', label: 'Без кассира', active: p1, set: setP1 },
                  { id: 'p2', label: 'Без официанта', active: p2, set: setP2 },
                  { id: 'p3', label: 'SR Delivery', active: p3, set: setP3 },
                  { id: 'p5', label: 'Лояльность', active: p5, set: setP5 },
                ].map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => p.set(!p.active)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${p.active ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                  >
                    <span className="font-bold text-slate-700">{p.label}</span>
                    {p.active && <Check className="text-green-600" size={20} />}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Правая часть: Итоги */}
          <div className="lg:w-[400px]">
            <div className="sticky top-8 space-y-4">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl">
                <h3 className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Результат за 30 дней</h3>
                
                <div className="space-y-6">
                  <div className="text-center p-4 rounded-2xl bg-slate-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Прибыль сейчас</div>
                    <div className="text-2xl font-black text-slate-800">{formatM(results.now)} ₸</div>
                  </div>

                  <div className="text-center p-6 rounded-[24px] bg-green-500 text-white shadow-lg shadow-green-200">
                    <div className="text-[10px] font-bold opacity-80 uppercase mb-1">С Smart Restaurant</div>
                    <div className="text-3xl font-black">{formatM(results.smart)} ₸</div>
                  </div>

                  <div className="bg-green-100 p-4 rounded-2xl text-center border-2 border-green-200">
                    <div className="text-[10px] font-bold text-green-600 uppercase mb-1">Выгода внедрения</div>
                    <div className="text-2xl font-black text-green-700">+{formatM(results.smart - results.now)} ₸</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
