package com.example.tao

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import androidx.fragment.app.Fragment


private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

class Home : Fragment() {
    // TODO: Rename and change types of parameters
    private var param1: String? = null
    private var param2: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            param1 = it.getString(ARG_PARAM1)
            param2 = it.getString(ARG_PARAM2)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        // Find buttons by their IDs
        val cube1 = view.findViewById<Button>(R.id.cube1)
        val cube2 = view.findViewById<Button>(R.id.cube2)
        val cube3 = view.findViewById<Button>(R.id.cube3)

        // Set click listeners for buttons
        val message = "გაკვეთილი მალე დაემატება"
        cube1.setOnClickListener {
            Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
        }
        cube2.setOnClickListener {
            Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
        }
        cube3.setOnClickListener {
            Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
        }

        return view
    }

    companion object {

        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            Home().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}
