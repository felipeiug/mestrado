import torch
import torch.nn as nn
import torch.nn.functional as F

class MoE(nn.Module):
    def __init__(self, experts:list[nn.Module], in_features:int, n_experts:int):
        super().__init__()

        self.n_experts = n_experts
        self.experts = nn.ModuleList(experts)
        self.gate = nn.Linear(in_features, len(experts))
        
    def forward(self, x):
        # Passo 1: Calcular pesos dos experts
        gate_scores = F.softmax(self.gate(x), dim=-1)
        
        # Passo 2: Selecionar top-k experts
        top_k_val, top_k_idx = torch.topk(gate_scores, k=self.n_experts)
        
        # Passo 3: Processar com experts selecionados
        output = torch.zeros_like(x)
        for i, expert in enumerate(self.experts):
            # Criar máscara para os exemplos que usam este expert
            mask = (top_k_idx == i).any(dim=-1)
            if mask.any():
                output[mask] += expert(x[mask]) * top_k_val[mask].sum(dim=-1, keepdim=True)
                
        return output