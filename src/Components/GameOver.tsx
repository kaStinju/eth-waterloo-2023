function GameOver({ gameMessage }: { gameMessage: string }) {
  return (
    <div className='login'>
      <h1 style={{ fontSize: 80 }}>
        {gameMessage}
      </h1>
      <img src={`https://noun.pics/${Math.floor(Math.random() * 500)}}`} style={{ "height": "100%", "width": "400px" }} />
    </div>
  )
}

export default GameOver