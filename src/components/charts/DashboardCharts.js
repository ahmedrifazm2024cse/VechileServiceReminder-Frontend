import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

const chartCardStyle = {
  background: '#fff', borderRadius: 14,
  padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  border: '1px solid #f1f5f9',
};

export const RegistrationsChart = ({ data = [] }) => (
  <div style={chartCardStyle}>
    <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
      Monthly User Registrations
    </h3>
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13 }}
        />
        <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} fill="url(#regGrad)" name="Users" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const ServicesChart = ({ data = [] }) => (
  <div style={chartCardStyle}>
    <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
      Monthly Services Recorded
    </h3>
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13 }}
        />
        <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} name="Services" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const BrandDistributionChart = ({ data = [] }) => (
  <div style={chartCardStyle}>
    <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
      Vehicles by Brand
    </h3>
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data} cx="50%" cy="50%"
          innerRadius={55} outerRadius={90}
          dataKey="count" nameKey="brand"
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13 }}
        />
        <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export const MiniServiceChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height={60}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#miniGrad)" dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);
