import torch
import torch.nn as nn

# Modelo (MLP e CNN)
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(
                in_channels=9,    # Número de bandas do raster de entrada
                out_channels=16,
                kernel_size=3,
                padding=1
            ),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),
            nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2),
        ).to(dtype=torch.float64)
        self.flatten = nn.Flatten().to(dtype=torch.float64)
        self.fc = nn.Sequential(
            nn.Linear(
                (1152) + 1, # Tamanho da saída da convolução + dist_talvegue
                64
            ),
            nn.Sigmoid(),
            nn.Linear(64, 64),
            nn.GELU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.Sigmoid(),
            nn.Linear(16, 1)
        ).to(dtype=torch.float64)

    def forward(self, raster, values):
        x = self.conv(raster)
        x = self.flatten(x)
        x = torch.cat([x, values], dim=1)
        x = self.fc(x)
        return x

