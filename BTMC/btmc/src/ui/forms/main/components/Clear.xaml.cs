using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using btmc.src.ui.forms.main.tabs;

namespace btmc.src.ui.forms.main.components
{
    public partial class Clear : Button
    {
        public Clear()
        {
            InitializeComponent();
            this.Click += Clear_Click;
            // ✅ should show when placed in constructor
        }

        private void Clear_Click(object sender, RoutedEventArgs e)
        {
            DependencyObject parent = this;
            while (parent != null && parent is not BaseConverter)
                parent = VisualTreeHelper.GetParent(parent);

            if (parent is BaseConverter baseConverter)
            {
                var inputs = baseConverter.GetActiveInputTextBoxes();
                ClearInputs(ref inputs);
            }
        }

        public static void ClearInputs(ref TextBox[] inputs)
        {
            foreach (TextBox input in inputs)
            {
                var placeholder = PlaceholderBehavior.GetPlaceholder(input);

                if (!string.IsNullOrWhiteSpace(input.Text) && input.Text != placeholder)
                {
                    input.Text = string.Empty;

                    // ✅ Apply placeholder immediately without waiting for focus change
                    if (string.IsNullOrWhiteSpace(input.Text))
                    {
                        input.Text = placeholder;
                        input.Foreground = Brushes.Gray;
                    }
                }
            }
        }


    }

}
