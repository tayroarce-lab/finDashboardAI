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
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Package size={32} color="#6366f1" /> Gestión de Inventario
          </h1>
          <p className="text-muted">Control de insumos, materiales y equipos dentales</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">
            <History size={16} /> Movimientos
          </button>
          <button className="btn btn-primary">
            <Plus size={16} /> Nuevo Ítem
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="inventory-stats">
        {[
          { icon: Package, label: 'Total Ítems', value: stats.totalItems, color: 'purple' },
          { icon: AlertCircle, label: 'Stock Bajo', value: stats.lowStock, color: 'red' },
          { icon: ShoppingCart, label: 'Valorizado', value: `$${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: 'green' },
          { icon: TrendingDown, label: 'Categorías', value: stats.categories, color: 'blue' }
        ].map((s, i) => (
          <div key={i} className={`card stat-card stagger-${i+1}`}>
            <div className={`stat-icon ${s.color}`}><s.icon size={20} /></div>
            <div className="stat-content">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card inventory-main animate-fade-in stagger-3">
        <div className="inventory-controls">
          <div className="search-wrap">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o SKU..." 
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
            <option value="all">Todas las Categorías</option>
            <option value="low">⚠️ Stock Bajo</option>
            <option value="supplies">Insumos</option>
            <option value="medicine">Medicamentos</option>
            <option value="equipment">Equipos</option>
            <option value="office">Oficina</option>
          </select>
        </div>

        {loading ? (
          <div className="grid-list-loading">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} height="72px" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState 
            icon={ArchiveX}
            title="Inventario vacío"
            description="No encontramos productos que coincidan con tu búsqueda o filtros."
            actionLabel="Limpiar filtros"
            onAction={() => { setSearchTerm(''); setFilter('all'); }}
          />
        ) : (
          <div className="table-wrap">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Ítem / SKU</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Estado</th>
                  <th>Costo Prom.</th>
                  <th>Valor Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} className={item.is_low_stock ? 'row-alert' : ''}>
                    <td>
                      <div className="item-info">
                        <strong>{item.name}</strong>
                        <span className="text-muted text-xs">{item.sku || 'SIN-SKU'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-cat badge-${item.category}`}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="stock-info">
                        <span className={`stock-number ${item.is_low_stock ? 'text-red font-bold' : ''}`}>
                          {item.stock_current} {item.unit}
                        </span>
                        <span className="text-xs text-muted">Mín: {item.stock_min}</span>
                      </div>
                    </td>
                    <td>
                      {item.is_low_stock ? (
                        <span className="status-indicator low">
                          <AlertCircle size={12} /> Reordenar
                        </span>
                      ) : (
                        <span className="status-indicator ok">En Stock</span>
                      )}
                    </td>
                    <td>${item.average_cost.toFixed(2)}</td>
                    <td>
                      <strong>${(item.stock_current * item.average_cost).toFixed(2)}</strong>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-icon" title="Entrada de Stock">
                          <ArrowUpRight size={16} color="#10b981" />
                        </button>
                        <button className="btn-icon" title="Salida / Consumo">
                          <ArrowDownRight size={16} color="#f43f5e" />
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
