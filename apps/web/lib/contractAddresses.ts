// Monad Testnet Contract Addresses
// Target blockchain: Monad Testnet (Chain ID 10143)

export const CONTRACT_ADDRESSES = {
  // HuntCore game brain contract
  HUNT_CORE: (process.env.NEXT_PUBLIC_HUNT_CORE_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0") as `0x${string}`,
  
  // Beast NFT ERC-721 contract
  BEAST_NFT: (process.env.NEXT_PUBLIC_BEAST_NFT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`,
  
  // Settler / Oracle Resolver address for authorized EIP-712 signatures
  SETTLER: (process.env.NEXT_PUBLIC_RESOLVER_ADDRESS || "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720") as `0x${string}`,

  // Aliases for compatibility
  ARENA: (process.env.NEXT_PUBLIC_HUNT_CORE_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0") as `0x${string}`,
  TERRITORY: (process.env.NEXT_PUBLIC_HUNT_CORE_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0") as `0x${string}`,
  RESOLVER: (process.env.NEXT_PUBLIC_RESOLVER_ADDRESS || "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720") as `0x${string}`,
};
