// Monad Testnet Contract Addresses
// Configured for Monad Blitz Mumbai V4 (Chain ID 10143)

export const CONTRACT_ADDRESSES = {
  // Deployed / Target addresses on Monad Testnet
  BEAST_NFT: (process.env.NEXT_PUBLIC_BEAST_NFT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`,
  ARENA: (process.env.NEXT_PUBLIC_ARENA_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512") as `0x${string}`,
  TERRITORY: (process.env.NEXT_PUBLIC_TERRITORY_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0") as `0x${string}`,
  
  // Oracle Resolver address for authorized battle result signatures
  RESOLVER: (process.env.NEXT_PUBLIC_RESOLVER_ADDRESS || "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720") as `0x${string}`,
};
