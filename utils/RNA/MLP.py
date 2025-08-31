import torch
import torch.nn as nn

# Estrutura da RNA
pytorch_layers = {
    "Lineares":{
        "Linear": {
            "desc": "Camada totalmente conectada (input_size, output_size)",
            "in": "(in_features: int, out_features: int, bias: bool = True)",
            "out": "(batch_size, *, out_features)"
        },
        "Bilinear": {
            "desc": "Mapeamento bilinear de duas entradas",
            "in": "(in1_features: int, in2_features: int, out_features: int, bias: bool = True)",
            "out": "(batch_size, *, out_features)"
        },
    },

    # ========== CONVOLUÇÃO ==========
    "Convolução":{
        "Conv1d": {
            "desc": "Convolução 1D para séries temporais/áudio",
            "in": "(in_channels: int, out_channels: int, kernel_size: int, stride: int = 1, padding: int = 0)",
            "out": "(batch_size, out_channels, L_out)"
        },
        "Conv2d": {
            "desc": "Convolução 2D para imagens",
            "in": "(in_channels: int, out_channels: int, kernel_size: Union[int, Tuple], stride: Union[int, Tuple] = 1, padding: Union[int, Tuple] = 0)",
            "out": "(batch_size, out_channels, H_out, W_out)"
        },
    },

    # ========== POOLING ==========
    "Pooling":{
        "MaxPool2d": {
            "desc": "Pooling máximo 2D (redução dimensional)",
            "in": "(kernel_size: Union[int, Tuple], stride: Union[int, Tuple] = None, padding: Union[int, Tuple] = 0)",
            "out": "(batch_size, channels, H_out, W_out)"
        },
    },

    # ========== NORMALIZAÇÃO ==========
    "Normalização":{
        "BatchNorm2d": {
            "desc": "Normalização por batch para CNNs",
            "in": "(num_features: int, eps: float = 1e-05, momentum: float = 0.1)",
            "out": "(batch_size, num_features, H, W)"
        },
    },

    # ========== ATIVAÇÃO ==========
    "Ativação":{
        "ReLU": {
            "desc": "Ativação Rectified Linear Unit",
            "in": "(inplace: bool = False)",
            "out": "Mesma forma da entrada"
        },
        "Sigmoid": {
            "desc": "Função sigmoide (compressão 0-1)",
            "in": "()",
            "out": "Mesma forma da entrada"
        },
    },

    # ========== RECORRENTES ==========
    "Recorrência":{
        "LSTM": {
            "desc": "Long Short-Term Memory network",
            "in": "(input_size: int, hidden_size: int, num_layers: int = 1)",
            "out": "(output: (seq_len, batch, hidden_size), (h_n, c_n))"
        },
    },

    # ========== DROPOUT ==========
    "Dropout":{
        "Dropout": {
            "desc": "Regularização por desativação aleatória",
            "in": "(p: float = 0.5, inplace: bool = False)",
            "out": "Mesma forma da entrada"
        },
    },

    # ========== EMBEDDING ==========
    "Embedding":{
        "Embedding": {
            "desc": "Mapeia índices para vetores densos",
            "in": "(num_embeddings: int, embedding_dim: int)",
            "out": "(*, embedding_dim)"
        },
    },

    # ========== TRANSFORMER ==========
    "Transformer":{
        "MultiheadAttention": {
            "desc": "Mecanismo de atenção multi-head",
            "in": "(embed_dim: int, num_heads: int, dropout: float = 0.0)",
            "out": "(attn_output, attn_weights)"
        },
    },
}

class NN(nn.Module):
    def __init__(self, input_size, hidden_sizes, output_size):
        super().__init__()
        
        # Cria um ModuleList para armazenar as camadas
        self.layers = nn.ModuleList()
        
        # Adiciona a primeira camada (input -> hidden1)
        self.layers.append(nn.Linear(input_size, hidden_sizes[0]))
        
        # Adiciona camadas ocultas
        for i in range(1, len(hidden_sizes)):
            self.layers.append(nn.Linear(hidden_sizes[i-1], hidden_sizes[i]))
        
        # Camada de saída
        self.layers.append(nn.Linear(hidden_sizes[-1], output_size))
        
    def forward(self, x):  # Implementação obrigatória
        for layer in self.layers[:-1]:
            x = torch.relu(layer(x))  # ReLU para todas, exceto a última
        x = self.layers[-1](x)  # Última camada (sem ativação)
        return x

