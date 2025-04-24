import torch

print("number of GPU", torch.cuda.device_count())
print("GPU name", torch.cuda.get_device_name())

device = torch.device('cuda' if torch.cuda.is_available()else 'cpu')
print('using device: ', device)