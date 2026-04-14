import { useState, useEffect } from 'react';
import { Package, Plus, Search, AlertCircle, ShoppingCart, History, TrendingDown, ArrowUpRight, ArrowDownRight, ArchiveX } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import './Inventory.css';

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: 'supplies' | 'equipment' | 'medicine' | 'office' | 'other';
  stock_current: number;
  stock_min: number;
  unit: string;
  average_cost: number;
  last_purchase_price: number;
  is_low_stock: boolean;
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inventory/status');
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('No se pudo cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || 
                          (filter === 'low' && item.is_low_stock) || 
                          (item.category === filter);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalItems: items.length,
    lowStock: items.filter(i => i.is_low_stock).length,
    totalValue: items.reduce((acc, current) => acc + (current.stock_current * current.average_cost), 0),
    categories: [...new Set(items.map(i => i.category))].length
  };

  return (
    <div className="inventory-page animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="flex items-center gap-3">
            <Package size={32} className="text-accent" /> Control de Inventario
          </h1>
          <p className="text-muted">Gestión de insumos y materiales críticos para la operación</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">
            <History size={16} /> Movimientos
          </button>
          <button className="btn btn-primary">
            <Plus size={16} /> Agregar Ítem
          </button>
        </div>
      </header>
 
      <div className="inventory-stats">
        {[
          { icon: Package, label: 'Ítems Totales', value: stats.totalItems, color: 'purple' },
          { icon: AlertCircle, label: 'Stock Bajo', value: stats.lowStock, color: 'red' },
          { icon: ShoppingCart, label: 'Valor de Bodega', value: `$${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: 'green' },
          { icon: TrendingDown, label: 'Categorías', value: stats.categories, color: 'blue' }
        ].map((s, i) => (
          <div key={i} className={`card stat-card animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`stat-icon ${s.color}`}><s.icon size={20} /></div>
            <div className="stat-content">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
            </div>
          </div>
        ))}
      </div>
 
      <div className="card inventory-main animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="inventory-controls">
          <div className="search-wrap">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, SKU o categoría..." 
              className="input search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="input filter-select select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Filtro: Todos los Materiales</option>
            <option value="low">⚠️ Nivel Crítico (Stock Bajo)</option>
            <option value="supplies">Insumos Clínicos</option>
            <option value="medicine">Medicamentos & Anestesia</option>
            <option value="equipment">Instrumental & Equipo</option>
          </select>
        </div>
 
        {loading ? (
          <div className="p-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} height="72px" className="mb-3" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState 
            icon={ArchiveX}
            title="Resultados no encontrados"
            description="No hay materiales que coincidan con los criterios de búsqueda actuales."
            actionLabel="Ver todo el inventario"
            onAction={() => { setSearchTerm(''); setFilter('all'); }}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Material / Referencia</th>
                  <th>Categoría</th>
                  <th>Disponibilidad</th>
                  <th>Prioridad</th>
                  <th>Valorizado</th>
                  <th>Operaciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} className={item.is_low_stock ? 'row-alert' : ''}>
                    <td>
                      <div className="item-info">
                        <strong>{item.name}</strong>
                        <span className="text-muted text-xs">{item.sku || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${item.category === 'medicine' ? 'red' : item.category === 'supplies' ? 'blue' : 'purple'}`}>
                        {item.category === 'supplies' ? 'Insumo' : item.category === 'medicine' ? 'Fármaco' : 'Equipo'}
                      </span>
                    </td>
                    <td>
                      <div className="stock-info">
                        <span className={`stock-number ${item.is_low_stock ? 'text-red font-bold' : 'text-primary'}`}>
                          {item.stock_current} {item.unit}
                        </span>
                        <span className="text-xs text-muted">Mínimo: {item.stock_min}</span>
                      </div>
                    </td>
                    <td>
                      {item.is_low_stock ? (
                        <span className="status-indicator low">
                          <AlertCircle size={12} /> CRÍTICO
                        </span>
                      ) : (
                        <span className="status-indicator ok">Estable</span>
                      )}
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <strong>${(item.stock_current * item.average_cost).toFixed(2)}</strong>
                        <span className="text-xs text-muted">u: ${item.average_cost.toFixed(2)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-icon" title="Entrada Stock">
                          <Plus size={14} className="text-green" />
                        </button>
                        <button className="btn-icon" title="Ajuste / Salida">
                          <TrendingDown size={14} className="text-red" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
