<script lang="ts" context="module">
	interface customWindow extends Window {
		starknet?: {
			enable: () => Promise<[string]>
			account: {
				deployContract: (params: {
					classHash: string
					constructorCalldata: Array<string>
				}) => Promise<unknown>
			}
		}
	}

	declare const window: customWindow
</script>

<script lang="ts">
	let address = $state<string>()
	let tokenName = $state('')
	let tokenSymbol = $state('')
	let tokenSupply = $state('')

	async function connect() {
		try {
			if (!window.starknet) return alert('No Starknet wallet is found.')
			const [userAddress] = await window.starknet.enable()
			address = userAddress
		} catch (error) {
			if (error.message === 'User aborted') return
			console.error(error)
			console.log(error.message)
			alert('Open Console To See The Error!')
		}
	}

	async function disconnect() {
		address = undefined
	}

	async function createToken(e: SubmitEvent) {
		try {
			e.preventDefault()
			if (!window.starknet) return alert('No Starknet wallet is found.')
			if (!address) return alert('Wallet is not connected.')
			const account = window.starknet.account

			const name = tokenName
			const symbol = tokenSymbol
			const supply = BigInt(tokenSupply)

			const ascii = /[\p{ASCII}]+/u

			if (!ascii.test(name) || !ascii.test(symbol))
				return alert('Only English Characters Are Supported!')

			const [firstByteOfSupply, secondByteOfSupply] = u256ToTwoU128(
				supply * BigInt('1000000000000000000')
			)

			const calldata: string[] = [
				toBigint(name).toString(),
				toBigint(symbol).toString(),
				firstByteOfSupply.toString(),
				secondByteOfSupply.toString(),
				BigInt(address).toString()
			]
			console.log(calldata)

			await account.deployContract({
				classHash: '0x06630fb37348de1310b11632fcb54b1762a47a2bcf010b14b6e483a00e951303',
				constructorCalldata: calldata
			})
		} catch (error) {
			if (error.message === 'User aborted') return
			console.error(error)
			console.log(error.message)
			alert('Open Console To See The Error!')
		}
	}

	function toBigint(str: string): bigint {
		let result = '0x'
		for (let i = 0; i < str.length; i++) {
			result += str.charCodeAt(i).toString(16)
		}
		const num = BigInt(result)
		return num
	}

	function u256ToTwoU128(u256: bigint): [bigint, bigint] {
		const MAX_U128 = BigInt('340282366920938463463374607431768211456')
		const secondByte = u256 / MAX_U128
		const firstByte = u256 - MAX_U128 * secondByte
		return [firstByte, secondByte]
	}
</script>

<header
	class="sticky top-0 z-30 flex h-18 items-center justify-between bg-yellow-50/80 px-4 backdrop-blur-md md:px-8"
>
	<a href="/" class="text-2xl font-bold text-cyan-500/80">Starknet Token Creator</a>
	<button
		class="flex h-11 items-center justify-center rounded-full bg-cyan-500/80 px-7 text-lg font-bold text-white duration-200 hover:bg-cyan-500/60 disabled:cursor-not-allowed disabled:hover:bg-cyan-500/80"
		onclick={address ? disconnect : connect}
	>
		{#if address}
			Disconnect
		{:else}
			Connect
		{/if}
	</button>
</header>

<main class="flex flex-1 flex-col items-center justify-center py-24 sm:py-28 md:py-32 lg:py-36">
	<section class="flex flex-col items-center gap-8 px-4 md:px-8">
		<div class="flex flex-col items-center gap-4">
			<h1 class="text-4xl font-bold sm:text-5xl">Starknet Token Creator</h1>
			<form class="flex w-full max-w-xs flex-col gap-4" onsubmit={createToken}>
				<input
					class="h-10 rounded-full border border-neutral-300 bg-white px-5 outline-none placeholder:text-neutral-300 hover:border-neutral-400 focus:border-neutral-400"
					name="token-name"
					maxlength="31"
					type="text"
					required
					placeholder="Name (Bitcoin)"
					bind:value={tokenName}
				/>
				<input
					class="h-10 rounded-full border border-neutral-300 bg-white px-5 uppercase outline-none placeholder:text-neutral-300 hover:border-neutral-400 focus:border-neutral-400"
					name="token-symbol"
					maxlength="31"
					type="text"
					required
					placeholder="Symbol (BTC)"
					bind:value={tokenSymbol}
				/>
				<input
					class="h-10 rounded-full border border-neutral-300 bg-white px-5 outline-none placeholder:text-neutral-300 hover:border-neutral-400 focus:border-neutral-400"
					name="token-supply"
					maxlength="31"
					type="number"
					required
					placeholder="Supply (21000000)"
					bind:value={tokenSupply}
				/>
				<button
					class="h-10 rounded-full bg-cyan-500/80 px-7 font-bold text-white duration-200 hover:bg-cyan-500/60 disabled:cursor-not-allowed disabled:hover:bg-cyan-500/80"
					disabled={!address}
					type="submit">Create</button
				>
			</form>
		</div>
		<div class="flex flex-col items-center">
			<p><span class="font-bold">1</span> - Visit Starkscan after you create a token.</p>
			<p><span class="font-bold">2</span> - Find contract deployment address.</p>
			<p><span class="font-bold">3</span> - Add the token in your wallet.</p>
		</div>
		<div class="flex flex-col items-center">
			<p>
				<span class="font-bold">Note:</span>
				<a
					href="https://github.com/BerzanOrg/starknet-token-contract"
					target="_blank"
					class="hover:underline">The smart contract is open-source.</a
				>
			</p>
		</div>
		<div class="flex flex-col items-center">
			<p class="font-bold">You can donate me at:</p>
			<p class="break-all text-center text-sm">
				0x01f351ad804a7a600c4a96974c37c5a59c5febae383af6a96336c7634c73fdaf
			</p>
		</div>
		<div class="flex flex-col items-center">
			<p>
				Built with love, sweat and tears by <a
					href="https://berzan.org"
					target="_blank"
					class="underline">Berzan</a
				>.
			</p>
		</div>
	</section>
</main>

<footer class="flex justify-center py-20 pb-10">
	<div
		class="flex w-full max-w-6xl flex-col gap-14 px-4 md:flex-row-reverse md:items-end md:justify-between md:px-8"
	>
		<div class="flex flex-col gap-4 md:flex-row md:gap-8">
			<div class="flex flex-col">
				<p class="text-lg font-bold">Source Code</p>
				<a
					href="https://github.com/BerzanOrg/starknet-token-creator"
					target="_blank"
					class="hover:underline">Website</a
				>
				<a
					href="https://github.com/BerzanOrg/starknet-token-contract"
					target="_blank"
					class="hover:underline">Smart Contract</a
				>
			</div>
		</div>
		<p class="font-medium">© Starknet Token Creator | 2024</p>
	</div>
</footer>
