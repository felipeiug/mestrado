import numpy as np

def nse(y_pred, y_true, mean=None):
    """
    Entrada:
    y_pred, y_true
    """
    if mean is not None:
        y_true_mean = mean
    else:
        y_true_mean = np.mean(y_true)
        
    numerator = np.sum((y_pred - y_true) ** 2)
    denominator = np.sum((y_true - y_true_mean) ** 2)
    return 1 - (numerator / denominator)