<?php
namespace Beto\Quizwebapp\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Carbon\Carbon;
use RainLab\User\Models\User;

class AuthController extends Controller
{
    private $jwtSecret;
    private $tokenTTL; // số phút

    public function __construct()
    {
        $this->jwtSecret = env('JWT_SECRET', 'fallback_key');
        $this->tokenTTL = env('JWT_TTL', 60 * 24 * 7); // mặc định 7 ngày
    }

    /** -------- LOGIN -------- */
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !\Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $this->generateToken($user->id);

        return $this->withAuthCookie(
            response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'email' => $user->email
                ]
            ]),
            $token
        );
    }

    /** -------- REGISTER -------- */
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = new User();
        $user->first_name = $request->first_name;
        $user->email = $request->email;
        $user->password = $request->password;
        $user->save();

        $token = $this->generateToken($user->id);

        return $this->withAuthCookie(
            response()->json([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'email' => $user->email
                ]
            ]),
            $token
        );
    }

    /** -------- LOGOUT -------- */
    public function logout()
    {
        return response()->json(['message' => 'Logged out'])
            ->cookie('authToken', '', -1, '/', null, $this->isSecure(), true, false, 'Strict');
    }

    /** -------- PROFILE -------- */
    public function profile(Request $request)
    {
        $user = $request->user(); // lấy từ middleware

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json([
            'id' => $user->id,
            'first_name' => $user->first_name,
            'email' => $user->email
        ]);
    }


    /** -------- HELPER -------- */
    private function generateToken($userId)
    {
        $payload = [
            'sub' => $userId,
            'iat' => Carbon::now()->timestamp,
            'exp' => Carbon::now()->addMinutes($this->tokenTTL)->timestamp
        ];
        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }

    private function withAuthCookie($response, $token)
    {
        return $response->cookie(
            'authToken',
            $token,
            $this->tokenTTL, // phút
            '/',
            null,
            $this->isSecure(),
            true,   // HttpOnly
            false,
            'Strict'
        );
    }

    private function isSecure()
    {
        return !app()->environment('local'); // local = false, production = true
    }
}
