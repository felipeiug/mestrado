import numpy as np
from xgboost import XGBRegressor
from sklearn.ensemble import RandomForestRegressor

def run_rf_xgb(Ks: np.ndarray, sand: np.ndarray, silt: np.ndarray, clay: np.ndarray, train_percent:float = 50):
    # Seed para permitir reprodutibilidade dos valores pseudo-aleatórios
    seed = 42

    # Definir uma seed para reprodutibilidade
    rng = np.random.default_rng(seed)

    # Indices de treino e teste
    n_train = int(len(Ks)*train_percent/100)

    idxs = np.arange(len(Ks))
    idx_train = rng.choice(idxs, size=n_train, replace=False)

    X = np.stack([sand, silt, clay], axis=1) # type: ignore
    y = np.log10(Ks.astype(np.float64))

    X_train = X[idx_train]
    y_train = y[idx_train]

    rf = RandomForestRegressor()
    rf.fit(X_train, y_train)

    xgb = XGBRegressor()
    xgb.fit(X_train, y_train)

    return rf, xgb