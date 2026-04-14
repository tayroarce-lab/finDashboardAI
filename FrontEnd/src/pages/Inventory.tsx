import { useState, useEffect } from 'react';
import { Package, Plus, Search, AlertCircle, ShoppingCart, History, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';
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
    <div className="inventory-page">
      <header className="page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <Package size={32} color="#6366f1" /> Gestión de Inventario
          </h1>
          <p className="text-muted">Control de insumos, materiales y equipos dentales</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={16} /> Ver Movimientos
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Nuevo Ítem
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="inventory-stats">
        <div className="card stat-card">
          <div className="stat-icon purple"><Package size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Ítems</span>
            <span className="stat-value">{stats.totalItems}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon red"><AlertCircle size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Stock Bajo</span>
            <span className="stat-value">{stats.lowStock}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon green"><ShoppingCart size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Valorizado</span>
            <span className="stat-value">${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon blue"><TrendingDown size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Categorías</span>
            <span className="stat-value">{stats.categories}</span>
          </div>
        </div>
      </div>

      <div className="card inventory-main">
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
            className="input filter-select"
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
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Sincronizando almacén...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <Package size={48} className="empty-icon" />
            <h3>No se encontraron ítems</h3>
            <p>Ajusta el filtro o agrega un nuevo producto al catálogo.</p>
          </div>
        ) : (
          <div className="table-responsive">
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
