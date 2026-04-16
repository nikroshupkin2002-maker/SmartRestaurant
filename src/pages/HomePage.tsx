import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calculator, BarChart3, Users, Settings } from 'lucide-react';

const tools = [
  { 
    id: 'calculator', 
    title: 'Калькулятор выгоды', 
    desc: 'Рассчитайте потенциальную прибыль от внедрения продуктов Smart Restaurant.', 
    icon: Calculator,
    status: 'active' 
  },
  { 
    id: 'analytics', 
    title: 'Аналитика продаж', 
    desc: 'Глубокий анализ чеков, активности официантов и тепловые карты.', 
    icon: BarChart3,
    status: 'development' 
  },
  { 
    id: 'loyalty', 
    title: 'Программы лояльности', 
    desc: 'Управление акциями, кэшбеком и сегментацией клиентов.', 
    icon: Users,
    status: 'development' 
  },
  { 
    id: 'integration', 
    title: 'Интеграции', 
    desc: 'Настройки синхронизации с iiko, R-Keeper и Poster.', 
    icon: Settings,
    status: 'development' 
  }
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">F</div>
          <span className="font-bold text-slate-800">Smart Restaurant</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Меню инструментов</h1>
        <p className="text-slate-500 max-w-2xl">Добро пожаловать в экосистему Smart Restaurant. Выберите нужный инструмент для работы с показателями вашего заведения.</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={tool.status === 'active' ? { y: -5 } : {}}
            onClick={() => tool.status === 'active' && navigate('/calculator')}
            className={`bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden ${tool.status === 'active' ? 'cursor-pointer' : 'opacity-70'}`}
          >
            {tool.status === 'development' && (
              <span className="absolute top-4 right-4 bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">В разработке</span>
            )}
            <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${tool.status === 'active' ? 'bg-green-50 text-green-500' : 'bg-slate-50 text-slate-400'}`}>
              <tool.icon size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{tool.title}</h3>
            <p className="text-slate-500 leading-relaxed">{tool.desc}</p>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
