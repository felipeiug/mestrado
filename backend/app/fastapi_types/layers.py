from typing import Union, Tuple, Optional, Any
from pydantic import BaseModel, Field
import torch.nn as nn

class Linear(BaseModel):
    desc: str = """
## Camada Linear (`nn.Linear`)

### O que é?
A camada linear (também chamada de **fully connected** ou **densa**) é a pedra fundamental das redes neurais. Ela realiza uma transformação matemática onde:
- `x`: Dados de entrada  
- `W`: Matriz de pesos (aprendida durante o treinamento)  
- `b`: Termo de bias (opcional)  
- `y`: Saída transformada

### Parâmetros de Configuração

| Parâmetro       | Tipo | Descrição                                                                 | Exemplo Valido |
|-----------------|------|---------------------------------------------------------------------------|----------------|
| `in_features`   | int  | Número de características de entrada                                      | `256`          |
| `out_features`  | int  | Número de neurônios na camada (dimensão da saída)                         | `128`          |
| `bias`          | bool | Se `True`, adiciona um termo de ajuste (bias) a cada neurônio (recomendado) | `True`         |

### Como Funciona na Prática
1. **Num sistema de recomendação**:  
   - Entrada: Características do usuário (idade, histórico)  
   - Saída: Probabilidade de gostar de um produto  

2. **Em diagnóstico médico**:  
   - Entrada: Sintomas do paciente  
   - Saída: Chance de ter uma doença específica  

### Comportamento Durante o Treinamento
- A matriz `W` é ajustada automaticamente para aprender padrões nos dados
- O bias (`b`) ajuda a deslocar a função de ativação quando necessário
- Cada neurônio na camada opera independentemente nos dados

### Exemplo de Código
```python
# Cria uma camada que recebe 256 valores e produz 128 saídas
layer = nn.Linear(in_features=256, out_features=128)
input_data = torch.randn(32, 256)  # Batch de 32 amostras
output = layer(input_data)  # Formato: (32, 128)
    """
    in_features: int
    out_features: int
    bias: bool = True

    def __call__(self) -> nn.Module:
        return nn.Linear(
            in_features=self.in_features,
            out_features=self.out_features,
            bias=self.bias
        )

class Conv1d(BaseModel):
    desc: str = """
## Camada Conv1D (`nn.Conv1d`)

### 🔍 O que é?
A Conv1D é a camada de **convolução unidimensional** do PyTorch, especializada em processar:
- **Séries temporais** (dados financeiros, sensores)
- **Sinais de áudio** (onda sonora)
- **Sequências textuais** (quando representadas como embeddings)

### 📊 Parâmetros Principais
| Parâmetro         | Tipo        | Descrição                                                                 | Exemplo Válido   |
|-------------------|-------------|---------------------------------------------------------------------------|------------------|
| `in_channels`     | `int`       | Número de canais de entrada                                               | `1` (audio mono) |
| `out_channels`    | `int`       | Número de filtros/kernels                                                 | `64`             |
| `kernel_size`     | `int`       | Tamanho da janela deslizante (em amostras)                                | `3` ou `5`       |
| `stride`         | `int`       | Passo do filtro (default: 1)                                              | `2`              |
| `padding`        | `int`       | Zeros adicionados nas bordas (para controlar tamanho da saída)            | `1`              |
| `dilation`       | `int`       | Espaçamento entre elementos do kernel (para capturar padrões distantes)    | `2`              |
| `bias`           | `bool`      | Se adiciona termo de bias (default: `True`)                               | `False`          |

### 🛠️ Como Funciona?
Cada filtro:
1. Desliza ao longo da sequência
2. Realiza multiplicações pontuais
3. Gera um **mapa de características** unidimensional
"""
    in_channels: int
    out_channels: int
    kernel_size:int
    stride:int = 1
    padding:int = 0
    
    def __call__(self) -> nn.Module:
        return nn.Conv1d(
            in_channels=self.in_channels,
            out_channels=self.out_channels,
            kernel_size=self.kernel_size,
            stride=self.stride,
            padding=self.padding
        )

class Conv2d(BaseModel):
    desc: str = """
## Camada de Convolução 2D (`nn.Conv2d`)

### O que é?
A camada Conv2D é o "olho" das redes neurais para processamento de imagens. Ela desliza pequenos filtros (kernels) sobre a imagem para detectar padrões visuais, como bordas, texturas ou objetos. Funciona como um scanner inteligente que:

- Analisa pequenas regiões da imagem de cada vez
- Aprende padrões hierárquicos (de simples bordas até objetos complexos)
- Preserva relações espaciais entre pixels

### Parâmetros de Configuração

| Parâmetro        | Tipo               | Descrição                                                                 | Exemplo Válido       |
|------------------|--------------------|---------------------------------------------------------------------------|----------------------|
| `in_channels`    | int                | Número de canais de entrada (1 para preto e branco, 3 para RGB)           | `3`                  |
| `out_channels`   | int                | Número de filtros/kernels (cada um aprende um padrão diferente)           | `64`                 |
| `kernel_size`    | int ou (int, int)  | Tamanho da janela do filtro (altura x largura)                            | `3` ou `(5,3)`       |
| `stride`         | int ou (int, int)  | Passo do filtro (controla como ele se move na imagem)                     | `1` ou `(2,2)`       |
| `padding`        | int ou (int, int)  | Zeros adicionados nas bordas para controlar o tamanho da saída            | `0` ou `(1,1)`       |
| `bias`           | bool               | Se adiciona um termo de ajuste a cada filtro (normalmente True)           | `True`               |

### Como Funciona na Prática
1. **Reconhecimento Facial**:
   - Filtros iniciais detectam bordas
   - Camadas profundas reconhecem olhos, nariz, etc

2. **Diagnóstico por Imagem**:
   - Primeiras camadas identificam texturas
   - Camadas posteriores detectam anomalias como tumores

### Comportamento Durante o Treinamento
- Cada filtro/kernel aprende a responder a um padrão visual específico
- Os parâmetros são ajustados para maximizar a detecção de características úteis
- Operação local: cada filtro só "enxerga" uma pequena região por vez

### Exemplo de Código
```python
# Cria uma camada para processar imagens RGB (3 canais) com 64 filtros 3x3
conv_layer = nn.Conv2d(
    in_channels=3,
    out_channels=64,
    kernel_size=3,
    stride=1,
    padding=1
)

# Processa um lote de 16 imagens 128x128 RGB
input_images = torch.randn(16, 3, 128, 128)  # Formato: (batch, canais, altura, largura)
output = conv_layer(input_images)  # Saída: (16, 64, 128, 128)
    """
    in_channels: int
    out_channels: int
    kernel_size: Union[int, Tuple[int, int]]
    stride: Union[int, Tuple[int, int]] = 1
    padding: Union[int, Tuple[int, int]] = 0
    bias: bool = True

    def __call__(self) -> nn.Module:
        return nn.Conv2d(
            in_channels=self.in_channels,
            out_channels=self.out_channels,
            kernel_size=self.kernel_size,
            stride=self.stride,
            padding=self.padding,
            bias=self.bias
        )

class LSTM(BaseModel):
    desc: str = """
## Camada LSTM (`nn.LSTM`)

### O que é?
A LSTM (Long Short-Term Memory) é uma rede neural especializada em processar **sequências de dados** (como texto, séries temporais ou áudio), com capacidade de memorizar informações importantes por longos períodos.

### Parâmetros Principais

| Parâmetro       | O que significa?                                                                 | Exemplo |
|-----------------|---------------------------------------------------------------------------------|---------|
| `input_size`    | Número de características em cada passo da sequência (ex: 128 para embeddings)   | `128`   |
| `hidden_size`   | Tamanho da memória oculta (quantos neurônios a LSTM terá internamente)          | `256`   |
| `num_layers`    | Quantas LSTMs empilhadas (1 = básica, >1 = mais complexa)                       | `2`     |

### Saídas
A LSTM retorna dois tipos de informação:

1. **`output`**  
   - Contém **todas as previsões** em cada passo da sequência  
   - Formato: `(tamanho_da_sequência, batch_size, hidden_size)`  
   - *Exemplo:* Se processar 10 palavras, retorna 10 resultados intermediários

2. **`(h_n, c_n)`**  
   - `h_n`: Última saída da rede (o "resumo" de toda a sequência)  
   - `c_n`: Estado interno final (a "memória" acumulada)  
   - Formato: `(num_layers, batch_size, hidden_size)`  
   - *Uso comum:* `h_n` é ótimo para classificação final

### Exemplo Prático
Imagine que está processando uma frase:
```python
lstm = nn.LSTM(input_size=128, hidden_size=256, num_layers=2)
# Frase com 5 palavras, cada uma representada por 128 números
input = torch.randn(5, 1, 128)  # (sequência, batch, características)

output, (h_n, c_n) = lstm(input)

## Entendendo `num_layers` na LSTM

### O que é?
O parâmetro `num_layers` define quantas **camadas de LSTM estão empilhadas** uma sobre a outra. Funciona como uma escada de processamento:

- `num_layers=1` (Padrão):  
  → Uma única LSTM processa a sequência  
  → Equivalente a um andar único de processamento

- `num_layers>1` (LSTM Profunda):  
  → A saída da primeira LSTM vira entrada da próxima  
  → Cada camada aprende padrões mais complexos  
  → Como uma equipe de especialistas onde cada um refina o trabalho do anterior

### Exemplo Visual
# Arquitetura com 3 camadas:
input → LSTM_Camada1 → LSTM_Camada2 → LSTM_Camada3 → output
    """
    input_size: int
    hidden_size: int
    num_layers: int = 1

    def __call__(self) -> nn.Module:
        return nn.LSTM(
            input_size=self.input_size,
            hidden_size=self.hidden_size,
            num_layers=self.num_layers
        )

class Dropout(BaseModel):
    desc: str = """
    Técnica de regularização que "desliga" aleatoriamente neurônios durante o treinamento.
    Previne que a rede neural dependa demais de poucos neurônios específicos.
    
    Exemplo prático:
    - Funciona como um time de futebol que treina rodiziando jogadores, evitando depender só do astro.
    - Num sistema de crédito, força o modelo a considerar múltiplos fatores de risco, não só o score.
    """
    p: float = Field(0.5, ge=0, le=1)

    def __call__(self) -> nn.Module:
        return nn.Dropout(p=self.p)

class BatchNorm2d(BaseModel):
    desc: str = """
    Normaliza os dados entre camadas para manter a escala consistente durante o treinamento.
    Equivale a colocar todos os recursos na mesma "régua" antes de processar.
    
    Exemplo prático:
    - Num sistema que analisa exames de sangue, padroniza diferentes escalas (glicose em mg/dL, colesterol em mmol/L).
    - Em processamento de imagens, ajusta automaticamente brilho e contraste entre diferentes fotos.
    """
    num_features: int

    def __call__(self) -> nn.Module:
        return nn.BatchNorm2d(num_features=self.num_features)

class MultiheadAttention(BaseModel):
    desc: str = """
    Mecanismo de atenção que permite ao modelo focar em partes diferentes da entrada simultaneamente.
    Como um time de especialistas onde cada um analisa um aspecto diferente dos dados.
    
    Exemplo prático:
    - Em tradução automática, identifica sujeito, verbo e objeto em frases longas.
    - Em análise de contratos, destaca cláusulas importantes em diferentes seções do documento.
    """
    embed_dim: int
    num_heads: int

    def __call__(self) -> nn.Module:
        return nn.MultiheadAttention(
            embed_dim=self.embed_dim,
            num_heads=self.num_heads
        )

class ReLU(BaseModel):
    desc: str = """
# ReLU (Rectified Linear Unit)
**Fórmula**: `max(0, x)`

- Elimina gradientes negativos (vanishing gradient para x < 0)
- Computacionalmente eficiente
- Pode causar "neurônios mortos" (dead ReLU)
"""
    inplace: bool = False

    def __call__(self) -> nn.Module:
        return nn.ReLU(inplace=self.inplace)

class Sigmoid(BaseModel):
    desc: str = """
# Sigmoid
**Fórmula**: `1 / (1 + exp(-x))`

- Saída entre 0 e 1 (útil para probabilidades)
- Problemas com vanishing gradient em extremos
- Usada em classificação binária
"""

    def __call__(self) -> nn.Module:
        return nn.Sigmoid()

class Tanh(BaseModel):
    desc: str = """
# Tanh (Tangente Hiperbólica)
**Fórmula**: `(exp(x) - exp(-x)) / (exp(x) + exp(-x))`

- Saída entre -1 e 1
- Média zero (melhor que sigmoid para alguns casos)
- Still suffers from vanishing gradients
"""

    def __call__(self) -> nn.Module:
        return nn.Tanh()

class LeakyReLU(BaseModel):
    desc: str = """
# LeakyReLU
**Fórmula**: `max(αx, x)` onde α é pequeno (ex: 0.01)

- Tenta resolver o problema dos "neurônios mortos" do ReLU
- Permite um pequeno gradiente para valores negativos
"""
    negative_slope: float = 0.01
    inplace: bool = False

    def __call__(self) -> nn.Module:
        return nn.LeakyReLU(
            negative_slope=self.negative_slope,
            inplace=self.inplace
        )

class GELU(BaseModel):
    desc: str = """
# GELU (Gaussian Error Linear Unit)
**Fórmula**: `x * Φ(x)` (onde Φ é a CDF da distribuição normal)

- Aproximação suave do ReLU
- Usada em modelos como GPT e BERT
- Computacionalmente mais cara
"""

    def __call__(self) -> nn.Module:
        return nn.GELU()

class SiLU(BaseModel):
    desc: str = """
# SiLU (Sigmoid-Weighted Linear Unit)
**Fórmula**: `x * sigmoid(x)`

- Também chamada de Swish (paper do Google)
- Combina benefícios do ReLU e sigmoid
- Usada em arquiteturas modernas
"""

    def __call__(self) -> nn.Module:
        return nn.SiLU()

class Softmax(BaseModel):
    desc: str = """
# Softmax
**Fórmula**: `exp(x_i) / Σ(exp(x_j))`

- Saída é distribuição de probabilidade (soma = 1)
- Usada em classificação multiclasse
- Sensível a grandes diferenças nos valores de entrada
"""
    dim: Optional[int] = None

    def __call__(self) -> nn.Module:
        return nn.Softmax(dim=self.dim)

class MoE(BaseModel):
    desc: str = """
## 🧠 Mixture of Experts (MoE) - O que é?

Sim, a **Mixture of Experts** (Mistura de Especialistas) é uma arquitetura avançada de redes neurais que:

1. **Divide o problema** em sub-tarefas especializadas  
2. **Roteia dinamicamente** cada entrada para os "especialistas" mais relevantes  
3. **Combina inteligentemente** os resultados parciais

### 🔧 Como Funciona?
| Componente       | Função                                                                 |
|------------------|-----------------------------------------------------------------------|
| **Experts**      | Pequenas redes especializadas (ex: uma para texto, outra para imagens) |
| **Gating Network** | Rede de "controle" que decide quais experts usar para cada entrada    |
| **Routing**      | Sistema dinâmico que encaminha dados (sparse/dinâmico)                |

### 📊 Exemplo Técnico (PyTorch-like)
```python
class MixtureOfExperts(nn.Module):
    def __init__(self, num_experts, hidden_size):
        super().__init__()
        self.experts = nn.ModuleList([ExpertNetwork() for _ in range(num_experts)])
        self.gate = nn.Linear(hidden_size, num_experts)  # Rede de decisão

    def forward(self, x):
        # 1. O gate decide quais experts usar
        weights = F.softmax(self.gate(x), dim=-1)  # Probabilidades
        
        # 2. Roteamento esparso (top-k experts)
        top_k_weights, top_k_experts = torch.topk(weights, k=2)
        
        # 3. Processamento distribuído
        outputs = 0
        for i, expert in enumerate(self.experts):
            mask = (top_k_experts == i)
            if mask.any():
                outputs += expert(x) * top_k_weights[mask]
        
        return outputs
"""
    experts: list[Union[LSTM, GELU, SiLU, ReLU, Tanh, Linear, Conv1d, Conv2d, Softmax, Dropout, Sigmoid, LeakyReLU, BatchNorm2d, MultiheadAttention]]
    out_features: int
    bias: bool = True

LayerType = Union[MoE, LSTM, GELU, SiLU, ReLU, Tanh, Linear, Conv1d, Conv2d, Softmax, Dropout, Sigmoid, LeakyReLU, BatchNorm2d, MultiheadAttention]