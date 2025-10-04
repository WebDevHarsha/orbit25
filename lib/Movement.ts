import { Dimensions } from 'react-native'

export const MovementSystem = (entities: any, { time }: any) => {
  // Get current screen dimensions (in case of rotation or layout changes)
  const { width, height } = Dimensions.get('window')

  if (entities.player) {
    const { velocity, momentum } = entities.player
    const [currentX, currentY] = entities.player.position

    // Space physics constants
    const thrusterForce = 800 // How strong the thrusters are
    const friction = 0.98 // Space friction (very minimal, like 2% energy loss per frame)
    const deltaTime = time.delta / 1000 // Convert to seconds
    const bounceRestitution = 0.7 // How much energy is retained after bouncing

    // Initialize momentum if it doesn't exist
    if (!entities.player.momentum) {
      entities.player.momentum = { x: 0, y: 0 }
    }

    // Apply thruster force to momentum (Newton's first law - objects in motion stay in motion)
    if (velocity) {
      entities.player.momentum.x += velocity.x * thrusterForce * deltaTime
      entities.player.momentum.y += velocity.y * thrusterForce * deltaTime
    }

    // Apply space friction (minimal energy loss)
    entities.player.momentum.x *= friction
    entities.player.momentum.y *= friction

    // Calculate new position based on momentum
    const newX = currentX + entities.player.momentum.x * deltaTime
    const newY = currentY + entities.player.momentum.y * deltaTime

    // Player size for boundary checking
    const playerSize = 48 // 12 * 4 (w-12 h-12 in Tailwind = 48px)
    const halfPlayer = playerSize / 2

    // Boundary bouncing (like bouncing off space station walls)
    let finalX = newX
    let finalY = newY

    // Bounce off left and right walls
    if (newX <= halfPlayer) {
      finalX = halfPlayer
      entities.player.momentum.x =
        Math.abs(entities.player.momentum.x) * bounceRestitution
    } else if (newX >= width - halfPlayer) {
      finalX = width - halfPlayer
      entities.player.momentum.x =
        -Math.abs(entities.player.momentum.x) * bounceRestitution
    }

    // Bounce off top and bottom walls
    if (newY <= halfPlayer) {
      finalY = halfPlayer
      entities.player.momentum.y =
        Math.abs(entities.player.momentum.y) * bounceRestitution
    } else if (newY >= height - halfPlayer) {
      finalY = height - halfPlayer
      entities.player.momentum.y =
        -Math.abs(entities.player.momentum.y) * bounceRestitution
    }

    // Update player position
    entities.player.position = [finalX, finalY]
  }

  return entities
}
